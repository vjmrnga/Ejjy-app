import { SearchOutlined } from '@ant-design/icons';
import { Col, Divider, Input, Radio, Row, Select, Table } from 'antd';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { debounce } from 'lodash';
import * as queryString from 'query-string';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ColoredText } from '../../../../components';
import { CashieringCard } from '../../../../components/CashieringCard/CashieringCard';
import { FieldError, Label } from '../../../../components/elements';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { RequestWarnings } from '../../../../components/RequestWarnings/RequestWarnings';
import {
	EMPTY_CELL,
	MAIN_BRANCH_ID,
	SEARCH_DEBOUNCE_TIME,
} from '../../../../global/constants';
import {
	branchProductStatusOptions,
	pageSizeOptions,
} from '../../../../global/options';
import { request, requisitionSlipTypes } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useNetwork } from '../../../../hooks/useNetwork';
import { useQueryParams } from 'hooks';
import { IProductCategory } from '../../../../models';
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
	disabled: boolean;
}

export const BranchBalanceItem = ({
	branchId,
	productCategories,
	disabled,
}: Props) => {
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
	useEffect(() => () => {}, []);

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

			const currentBalance = formatQuantity(
				unit_of_measurement,
				current_balance,
			);

			const maxBalance = formatQuantity(unit_of_measurement, max_balance);

			const boBalance = formatQuantity(unit_of_measurement, bo_balance);

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
			component = <ColoredText variant="primary" text="Automatic" />;
		} else if (requisitionSlipTypes.MANUAL === type) {
			component = <ColoredText variant="secondary" text="Manual" />;
		}

		return component;
	};

	return (
		<div className="BranchBalanceItem">
			{hasInternetConnection === false && (
				<FieldError error="Cannot reach branch's API" />
			)}

			<>
				<CashieringCard
					branchId={branchId}
					className="BranchBalanceItem_cashieringCard"
					disabled={disabled || !hasInternetConnection}
					bordered
				/>

				<Divider dashed />

				<Filter
					productCategories={productCategories}
					hasBoBalanceFilter={branchId === MAIN_BRANCH_ID}
					setQueryParams={(params) => {
						setQueryParams(params, { shouldResetPage: true });
					}}
				/>
			</>

			<RequestErrors
				errors={convertIntoArray(branchProductsErrors, 'Branch Product')}
				withSpaceTop
				withSpaceBottom
			/>

			<RequestWarnings
				warnings={convertIntoArray(branchProductsWarnings, 'Branch Product')}
				withSpaceBottom
			/>

			<Table
				className="BranchBalanceItem_table"
				columns={columns}
				dataSource={data}
				scroll={{ x: 1000 }}
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
				loading={
					isCompletedInitialFetch
						? false
						: branchProductsStatus === request.REQUESTING
				}
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
					prefix={<SearchOutlined />}
					defaultValue={params.search}
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
					allowClear
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Category" spacing />
				<Select
					style={{ width: '100%' }}
					value={params.productCategory}
					onChange={(value) => {
						setQueryParams({ productCategory: value });
					}}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					showSearch
					allowClear
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
					style={{ width: '100%' }}
					value={params.productStatus}
					onChange={(value) => {
						setQueryParams({ productStatus: value });
					}}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					showSearch
					allowClear
				>
					{branchProductStatusOptions.map(({ name, value }) => (
						<Select.Option value={value}>{name}</Select.Option>
					))}
				</Select>
			</Col>

			{hasBoBalanceFilter && (
				<Col lg={12} span={24}>
					<Label label="Show has BO Balance" spacing />
					<Radio.Group
						options={[
							{ label: 'Show All', value: null },
							{ label: 'Has BO Balance', value: true },
						]}
						value={params.hasBoBalance}
						onChange={(e) => {
							const { value } = e.target;
							setQueryParams({ hasBoBalance: value });
						}}
						defaultValue={null}
						optionType="button"
					/>
				</Col>
			)}
		</Row>
	);
};
