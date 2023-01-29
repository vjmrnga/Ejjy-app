import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Radio, Row, Select, Table } from 'antd';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { ColoredText, RequestErrors, TableHeader } from 'components';
import { Label } from 'components/elements';
import {
	branchProductStatusOptions,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	MAIN_BRANCH_ID,
	pageSizeOptions,
	refetchOptions,
	requisitionSlipTypes,
	SEARCH_DEBOUNCE_TIME,
} from 'global';
import { useBranchProducts, useQueryParams } from 'hooks';
import _ from 'lodash';
import { IProductCategory } from 'models';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	formatDateTime,
	formatQuantity,
	getBranchProductStatus,
	getProductCode,
} from 'utils';

const currentBalanceColumn: ColumnType<any> = {
	title: 'Current Balance',
	dataIndex: 'currentBalance',
	align: 'center',
};

const columns: ColumnsType = [
	{ title: 'Code', dataIndex: 'code' },
	{ title: 'Name', dataIndex: 'name' },
	{
		title: 'Balance',
		children: [
			currentBalanceColumn,
			{
				title: 'BO Balance',
				dataIndex: 'boBalance',
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
				dataIndex: 'deliveryDate',
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

interface Props {
	branchId: number;
	productCategories: IProductCategory[];
	tableHeaderClassName?: string;
}

export const BranchProductBalances = ({
	branchId,
	productCategories,
	tableHeaderClassName,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branchProducts, total },
		isFetching: isFetchingBranchProducts,
		isFetched: isBranchProductsFetched,
		error: branchProductsErrors,
	} = useBranchProducts({
		params: {
			...params,
			hasBoBalance: params.hasBoBalance === 'true',
		},
		options: refetchOptions,
	});

	// METHODS
	useEffect(() => {
		if (branchId !== MAIN_BRANCH_ID) {
			columns[2] = currentBalanceColumn;
		}
	}, [branchId]);

	useEffect(() => {
		const data = branchProducts?.map((branchProduct) => {
			const {
				product,
				max_balance,
				current_balance,
				bo_balance,
				product_status,
				latest_requisition_slip,
			} = branchProduct;
			const { name, unit_of_measurement } = product;
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
				code: getProductCode(product),
				name,
				currentBalance: `${currentBalance} / ${maxBalance}`,
				boBalance,
				status: getBranchProductStatus(product_status),
				deliveryDate: datetime_created
					? formatDateTime(datetime_created)
					: EMPTY_CELL,
				type: renderRsType(type),
			};
		});

		setDataSource(data);
	}, [branchProducts]);

	const renderRsType = (type) => {
		let component: any = EMPTY_CELL;

		if (requisitionSlipTypes.AUTOMATIC === type) {
			component = <ColoredText text="Automatic" variant="primary" />;
		} else if (requisitionSlipTypes.MANUAL === type) {
			component = <ColoredText text="Manual" variant="secondary" />;
		}

		return component;
	};

	return (
		<>
			<TableHeader
				title="Branch Product Balances"
				wrapperClassName={tableHeaderClassName}
			/>

			<RequestErrors
				errors={convertIntoArray(branchProductsErrors, 'Branch Product')}
				withSpaceBottom
			/>

			<Filter
				hasBoBalanceFilter={branchId === MAIN_BRANCH_ID}
				isLoading={isFetchingBranchProducts && !isBranchProductsFetched}
				productCategories={productCategories}
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingBranchProducts && !isBranchProductsFetched}
				pagination={{
					current: Number(params.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
					onChange: (page, newPageSize) => {
						setQueryParams({
							page,
							pageSize: newPageSize,
						});
					},
					disabled: !dataSource,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				scroll={{ x: 1000 }}
				bordered
			/>
		</>
	);
};

interface FilterProps {
	isLoading: boolean;
	hasBoBalanceFilter: boolean;
	productCategories: any;
}

const Filter = ({
	isLoading,
	hasBoBalanceFilter,
	productCategories,
}: FilterProps) => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();

	// METHODS
	const handleSearchDebounced = useCallback(
		_.debounce((keyword) => {
			setQueryParams(
				{ search: keyword?.toLowerCase() },
				{ shouldResetPage: true },
			);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Row className="pb-6" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					defaultValue={params.search}
					prefix={<SearchOutlined />}
					allowClear
					onChange={(event) => handleSearchDebounced(event.target.value.trim())}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Category" spacing />
				<Select
					className="w-100"
					disabled={isLoading}
					filterOption={filterOption}
					optionFilterProp="children"
					value={params.productCategory}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams(
							{ productCategory: value },
							{ shouldResetPage: true },
						);
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
					className="w-100"
					disabled={isLoading}
					filterOption={filterOption}
					optionFilterProp="children"
					value={params.productStatus}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ productStatus: value }, { shouldResetPage: true });
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
						disabled={isLoading}
						options={[
							{ label: 'Show All', value: null },
							{ label: 'Has BO Balance', value: true },
						]}
						optionType="button"
						value={params.hasBoBalance}
						onChange={(e) => {
							setQueryParams(
								{ hasBoBalance: e.target.value },
								{ shouldResetPage: true },
							);
						}}
					/>
				</Col>
			)}
		</Row>
	);
};
