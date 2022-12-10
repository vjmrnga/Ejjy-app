import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Radio, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { RequestErrors, TableHeader } from 'components';
import { Box, Label } from 'components/elements';
import {
	branchProductStatusOptions,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	refetchOptions,
	SEARCH_DEBOUNCE_TIME,
} from 'global';
import { useBranchProducts, useProductCategories, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	formatQuantity,
	getBranchProductStatus,
	getLocalBranchId,
	getProductCode,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'Code', dataIndex: 'code' },
	{ title: 'Name', dataIndex: 'name' },
	{
		title: 'Balance',
		children: [
			{
				title: 'Current Balance',
				dataIndex: 'currentBalance',
				align: 'center',
			},
			{
				title: 'BO Balance',
				dataIndex: 'boBalance',
				align: 'center',
			},
		],
	},
	{ title: 'Status', dataIndex: 'status', align: 'center' },
];

export const BranchProductBalances = () => {
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
			branchId: getLocalBranchId(),
			hasBoBalance: params.hasBoBalance === 'true',
		},
		options: refetchOptions,
	});

	// METHODS
	useEffect(() => {
		const data = branchProducts.map((branchProduct) => {
			const {
				product,
				max_balance,
				current_balance,
				bo_balance,
				product_status,
			} = branchProduct;
			const { name, unit_of_measurement } = product;

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
			};
		});

		setDataSource(data);
	}, [branchProducts]);

	return (
		<Box>
			<TableHeader title="Branch Products Balances" />

			<RequestErrors
				className="px-6"
				errors={convertIntoArray(branchProductsErrors, 'Branch Product')}
				withSpaceBottom
			/>

			<Filter
				isLoading={isFetchingBranchProducts && !isBranchProductsFetched}
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
		</Box>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { productCategories },
		isFetching: isFetchingProductCategories,
		error: productCategoriesErrors,
	} = useProductCategories({
		params: { pageSize: MAX_PAGE_SIZE },
	});

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
		<>
			<RequestErrors
				className="px-6"
				errors={convertIntoArray(productCategoriesErrors, 'ProductCategories')}
				withSpaceBottom
			/>

			<Row className="pa-6 pt-0" gutter={[16, 16]}>
				<Col lg={12} span={24}>
					<Label label="Search" spacing />
					<Input
						defaultValue={params.search}
						prefix={<SearchOutlined />}
						allowClear
						onChange={(event) =>
							handleSearchDebounced(event.target.value.trim())
						}
					/>
				</Col>

				<Col lg={12} span={24}>
					<Label label="Category" spacing />
					<Select
						className="w-100"
						disabled={isLoading}
						filterOption={filterOption}
						loading={isFetchingProductCategories}
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
							setQueryParams(
								{ productStatus: value },
								{ shouldResetPage: true },
							);
						}}
					>
						{branchProductStatusOptions.map(({ name, value }) => (
							<Select.Option key={value} value={value}>
								{name}
							</Select.Option>
						))}
					</Select>
				</Col>

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
			</Row>
		</>
	);
};
