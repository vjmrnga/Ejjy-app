import { SearchOutlined } from '@ant-design/icons';
import { Col, Divider, Input, Radio, Row, Select, Table } from 'antd';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { ColoredText } from 'components';
import { FieldError, Label } from 'components/elements';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { RequestWarnings } from 'components/RequestWarnings/RequestWarnings';
import {
	branchProductStatusOptions,
	EMPTY_CELL,
	MAIN_BRANCH_ID,
	pageSizeOptions,
	request,
	requisitionSlipTypes,
	SEARCH_DEBOUNCE_TIME,
} from 'global';
import { useQueryParams } from 'hooks';
import { useBranchProducts } from 'hooks/useBranchProducts';
import { useNetwork } from 'hooks/useNetwork';
import { debounce } from 'lodash';
import { IProductCategory } from 'models';
import * as queryString from 'query-string';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	convertIntoArray,
	formatDateTime,
	formatQuantity,
	getBranchProductStatus,
} from 'utils';

const currentBalanceColumn: ColumnType<any> = {
	title: 'Current Balance',
	dataIndex: 'current_balance',
	align: 'center',
};

const columns: ColumnsType = [
	{ title: 'Barcode', dataIndex: 'barcode' },
	{ title: 'Name', dataIndex: 'name' },
	{
		title: 'Balance',
		children: [
			currentBalanceColumn,
			{
				title: 'BO Balance',
				dataIndex: 'bo_balance',
				align: 'center',
			},
		],
	},
	{ title: 'Status', dataIndex: 'status', align: 'center' },
	{
		title: 'Requisition Slip',
		children: [
			{
				title: 'Delivery Date',
				dataIndex: 'delivery_date',
				align: 'center',
			},
			{
				title: 'Type',
				dataIndex: 'type',
				align: 'center',
			},
		],
	},
];

const FETCH_INTERVAL_MS = 30000;
const NETWORK_INTERVAL_MS = 5000;

interface Props {
	branchId: number;
	productCategories: IProductCategory[];
}

export const BranchBalanceItem = ({ branchId, productCategories }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);
	const [hasInternetConnection, setHasInternetConnection] = useState(null);

	// CUSTOM HOOKS
	const {
		branchProducts,
		pageCount,
		pageSize,
		currentPage,
		getBranchProducts,
		status: branchProductsStatus,
		errors: branchProductsErrors,
		warnings: branchProductsWarnings,
	} = useBranchProducts();
	const { testBranchConnection } = useNetwork();

	const { setQueryParams } = useQueryParams({
		page: currentPage,
		pageSize,
		onQueryParamChange: (params) => {
			setIsCompletedInitialFetch(false);
			const newData = {
				...params,
				hasBoBalance: params.hasBoBalance === 'true',
			};

			getBranchProducts(newData, true);

			clearInterval(fetchIntervalRef.current);
			fetchIntervalRef.current = setInterval(() => {
				getBranchProducts(newData, true);
			}, FETCH_INTERVAL_MS);
		},
	});

	// REFS
	const fetchIntervalRef = useRef(null);
	const networkIntervalRef = useRef(null);

	// METHODS
	useEffect(() => {
		const testBranchConnectionFn = () => {
			testBranchConnection({ branchId }, ({ status }) => {
				if (status === request.SUCCESS) {
					setHasInternetConnection(true);
				} else if (status === request.ERROR) {
					setHasInternetConnection(false);
				}
			});
		};
		testBranchConnectionFn();
		networkIntervalRef.current = setInterval(
			testBranchConnectionFn,
			NETWORK_INTERVAL_MS,
		);

		return () => {
			// Cleanup in case logged out due to single sign on
			clearInterval(fetchIntervalRef.current);
			clearInterval(networkIntervalRef.current);
		};
	}, []);

	useEffect(() => {
		if (branchId !== MAIN_BRANCH_ID) {
			columns[2] = currentBalanceColumn;
		}
	}, [branchId]);

	useEffect(() => {
		if (!isCompletedInitialFetch && branchProducts.length) {
			setIsCompletedInitialFetch(true);
		}

		const newBranchProducts = branchProducts?.map((branchProduct) => {
			const {
				product,
				max_balance,
				current_balance,
				bo_balance,
				product_status,
				latest_requisition_slip,
			} = branchProduct;
			const { barcode, name, textcode, unit_of_measurement } = product;
			const { datetime_created, type } = latest_requisition_slip || {};

			const currentBalance = formatQuantity({
				unitOfMeasurement: unit_of_measurement,
				quantity: current_balance,
			});

			const maxBalance = formatQuantity({
				unitOfMeasurement: unit_of_measurement,
				quantity: max_balance,
			});

			const boBalance = formatQuantity({
				unitOfMeasurement: unit_of_measurement,
				quantity: bo_balance,
			});

			return {
				key: branchProduct.id,
				barcode: barcode || textcode,
				name,
				current_balance: `${currentBalance} / ${maxBalance}`,
				bo_balance: boBalance,
				status: getBranchProductStatus(product_status),
				delivery_date: datetime_created
					? formatDateTime(datetime_created)
					: EMPTY_CELL,
				type: type ? renderRsType(type) : EMPTY_CELL,
			};
		});

		setData(newBranchProducts);
	}, [branchProducts]);

	const renderRsType = (type) => {
		let component = null;

		if (requisitionSlipTypes.AUTOMATIC === type) {
			component = <ColoredText text="Automatic" variant="primary" />;
		} else if (requisitionSlipTypes.MANUAL === type) {
			component = <ColoredText text="Manual" variant="secondary" />;
		}

		return component;
	};

	return (
		<div className="BranchBalanceItem">
			{hasInternetConnection === false && (
				<FieldError error="Cannot reach branch's API" />
			)}

			<>
				{/* <CashieringCard
					branchId={branchId}
					className="BranchBalanceItem_cashieringCard"
					disabled={disabled || !hasInternetConnection}
					bordered
				/> */}

				<Divider dashed />

				<Filter
					hasBoBalanceFilter={branchId === MAIN_BRANCH_ID}
					productCategories={productCategories}
					setQueryParams={(params) => {
						setQueryParams(params, { shouldResetPage: true });
					}}
				/>
			</>

			<RequestErrors
				errors={convertIntoArray(branchProductsErrors, 'Branch Product')}
				withSpaceBottom
				withSpaceTop
			/>

			<RequestWarnings
				warnings={convertIntoArray(branchProductsWarnings, 'Branch Product')}
				withSpaceBottom
			/>

			<Table
				className="BranchBalanceItem_table"
				columns={columns}
				dataSource={data}
				loading={
					isCompletedInitialFetch
						? false
						: branchProductsStatus === request.REQUESTING
				}
				pagination={{
					current: currentPage,
					total: pageCount,
					pageSize,
					onChange: (page, newPageSize) => {
						setQueryParams({
							page,
							pageSize: newPageSize,
						});
					},
					disabled: !data,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				scroll={{ x: 1000 }}
				bordered
			/>
		</div>
	);
};

interface FilterProps {
	productCategories: IProductCategory[];
	hasBoBalanceFilter: boolean;
	setQueryParams: any;
}

const Filter = ({
	productCategories,
	hasBoBalanceFilter,
	setQueryParams,
}: FilterProps) => {
	const history = useHistory();
	const params = queryString.parse(history.location.search);

	// METHODS
	const onSearchDebounced = useCallback(
		debounce((keyword) => {
			setQueryParams({ search: keyword });
		}, SEARCH_DEBOUNCE_TIME),
		[params],
	);

	return (
		<Row gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					defaultValue={params.search}
					prefix={<SearchOutlined />}
					allowClear
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Category" spacing />
				<Select
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					optionFilterProp="children"
					style={{ width: '100%' }}
					value={params.productCategory}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ productCategory: value });
					}}
				>
					{productCategories.map(({ name }) => (
						<Select.Option key={name} value={name}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Status" spacing />
				<Select
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					optionFilterProp="children"
					style={{ width: '100%' }}
					value={params.productStatus}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ productStatus: value });
					}}
				>
					{branchProductStatusOptions.map(({ name, value }) => (
						<Select.Option key={value} value={value}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>

			{hasBoBalanceFilter && (
				<Col lg={12} span={24}>
					<Label label="Show has BO Balance" spacing />
					<Radio.Group
						defaultValue={null}
						options={[
							{ label: 'Show All', value: null },
							{ label: 'Has BO Balance', value: true },
						]}
						optionType="button"
						value={params.hasBoBalance}
						onChange={(e) => {
							const { value } = e.target;
							setQueryParams({ hasBoBalance: value });
						}}
					/>
				</Col>
			)}
		</Row>
	);
};
