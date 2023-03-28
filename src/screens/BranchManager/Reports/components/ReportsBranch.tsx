import { Col, Radio, Row, Select, Spin, Table } from 'antd';
import { ColumnsType, SorterResult } from 'antd/lib/table/interface';
import { RequestErrors, TableActions, TimeRangeFilter } from 'components';
import { Label } from 'components/elements';
import {
	ALL_OPTION_KEY,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	pageSizeOptions,
	productStatus,
	refetchOptions,
	timeRangeTypes,
} from 'global';
import {
	useBranchProductsWithAnalytics,
	useProducts,
	useQueryParams,
} from 'hooks';
import _ from 'lodash';
import { IProductCategory } from 'models';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	formatQuantity,
	getBranchProductStatus,
	getProductCode,
} from 'utils';
import { EditBranchProductsModal } from './EditBranchProductsModal';

const columns: ColumnsType = [
	{
		title: 'Name',
		dataIndex: 'name',
		width: 150,
		fixed: 'left',
	},
	{
		title: 'Code',
		dataIndex: 'code',
	},
	{
		title: 'Balance',
		children: [
			{
				title: 'Current Balance',
				dataIndex: 'balance',
				align: 'center',
			},
			{
				title: 'BO Balance',
				dataIndex: 'boBalance',
				align: 'center',
			},
		],
	},
	{
		title: 'Remaining Bal',
		dataIndex: 'remaining_balance',
		align: 'center',
	},
	{
		title: 'Quantity Sold',
		dataIndex: 'quantity_sold',
		align: 'center',
		sorter: true,
	},
	{
		title: 'Daily Average Sold',
		dataIndex: 'daily_average_sold',
		align: 'center',
		sorter: true,
	},
	{
		title: 'Average Quantity Sold Percentage',
		dataIndex: 'daily_average_sold_percentage',
		align: 'center',
		sorter: true,
	},
	{
		title: 'Average Daily Consumption',
		dataIndex: 'average_daily_consumption',
		align: 'center',
	},
	{
		title: 'Status',
		dataIndex: 'status',
	},
	{
		title: 'Actions',
		dataIndex: 'actions',
	},
];

const SEARCH_DEBOUNCE_TIME = 1000;

const sorts = {
	CURRENT_BALANCE_ASC: 'current_balance',
	CURRENT_BALANCE_DES: '-current_balance',
	QUANTITY_SOLD_ASC: 'quantity_sold',
	QUANTITY_SOLD_DES: '-quantity_sold',
	DAILY_AVERAGE_SOLD_ASC: 'daily_average_sold',
	DAILY_AVERAGE_SOLD_DES: '-daily_average_sold',
	DAILY_AVERAGE_SOLD_PERCENTAGE_ASC: 'daily_average_sold_percentage',
	DAILY_AVERAGE_SOLD_PERCENTAGE_DES: '-daily_average_sold_percentage',
};

const getSortOrder = (column, order) => {
	let sortOrder = null;

	if (!order) {
		return sortOrder;
	}

	if (column === 'balance') {
		sortOrder =
			order === 'ascend'
				? sorts.CURRENT_BALANCE_ASC
				: sorts.CURRENT_BALANCE_DES;
	} else if (column === 'quantity_sold') {
		sortOrder =
			order === 'ascend' ? sorts.QUANTITY_SOLD_ASC : sorts.QUANTITY_SOLD_DES;
	} else if (column === 'daily_average_sold') {
		sortOrder =
			order === 'ascend'
				? sorts.DAILY_AVERAGE_SOLD_ASC
				: sorts.DAILY_AVERAGE_SOLD_DES;
	} else if (column === 'daily_average_sold_percentage') {
		sortOrder =
			order === 'ascend'
				? sorts.DAILY_AVERAGE_SOLD_PERCENTAGE_ASC
				: sorts.DAILY_AVERAGE_SOLD_PERCENTAGE_DES;
	}

	return sortOrder;
};

interface Props {
	productCategories: IProductCategory[];
}

export const ReportsBranch = ({ productCategories }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBranchProduct, setSelectedBranchProduct] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branchProducts, total },
		isFetching: isFetchingBranchProducts,
		isFetched: isisBranchProductsFetched,
		error: branchProductsError,
	} = useBranchProductsWithAnalytics({
		params: {
			...params,
			hasBoBalance: params.hasBoBalance === 'true' ? true : undefined,
			isSoldInBranch:
				params?.isSoldInBranch === ALL_OPTION_KEY || !params?.isSoldInBranch
					? undefined
					: true,
			productIds:
				params?.productIds?.length > 0 ? params.productIds : undefined,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
		},
		options: refetchOptions,
	});

	// METHODS
	useEffect(() => {
		switch (params?.ordering) {
			case sorts.CURRENT_BALANCE_ASC:
				columns[2].sortOrder = 'ascend';
				break;
			case sorts.CURRENT_BALANCE_DES:
				columns[2].sortOrder = 'descend';
				break;
			case sorts.QUANTITY_SOLD_ASC:
				columns[4].sortOrder = 'ascend';
				break;
			case sorts.QUANTITY_SOLD_DES:
				columns[4].sortOrder = 'descend';
				break;
			case sorts.DAILY_AVERAGE_SOLD_ASC:
				columns[5].sortOrder = 'ascend';
				break;
			case sorts.DAILY_AVERAGE_SOLD_DES:
				columns[5].sortOrder = 'descend';
				break;
			case sorts.DAILY_AVERAGE_SOLD_PERCENTAGE_ASC:
				columns[6].sortOrder = 'ascend';
				break;
			case sorts.DAILY_AVERAGE_SOLD_PERCENTAGE_DES:
				columns[6].sortOrder = 'descend';
				break;
			default:
			// Do nothing
		}
	}, []);

	useEffect(() => {
		const data = branchProducts.map((branchProduct) => {
			const {
				product,
				bo_balance,
				max_balance,
				current_balance,
				product_status,
				quantity_sold,
				daily_average_sold,
				daily_average_sold_percentage,
				average_daily_consumption,
			} = branchProduct;
			const { name, unit_of_measurement } = product;
			const remainingBalance =
				(Number(current_balance) / Number(max_balance)) * 100;

			const currentBalance = formatQuantity({
				unitOfMeasurement: unit_of_measurement,
				quantity: current_balance,
			});

			const quantitySold = formatQuantity({
				unitOfMeasurement: unit_of_measurement,
				quantity: quantity_sold,
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
				code: getProductCode(product),
				name,
				balance: `${currentBalance} / ${maxBalance}`,
				boBalance,
				remaining_balance: `${remainingBalance.toFixed(2)}%`,
				quantity_sold: quantitySold,
				daily_average_sold,
				daily_average_sold_percentage: `${daily_average_sold_percentage}%`,
				average_daily_consumption: formatQuantity({
					unitOfMeasurement: unit_of_measurement,
					quantity: average_daily_consumption,
				}),
				status: getBranchProductStatus(product_status),
				actions: (
					<TableActions
						onEdit={() => {
							setSelectedBranchProduct(branchProduct);
						}}
					/>
				),
			};
		});

		setDataSource(data);
	}, [branchProducts]);

	return (
		<div>
			<RequestErrors
				className="px-6"
				errors={convertIntoArray(branchProductsError)}
			/>

			<Filter productCategories={productCategories} />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingBranchProducts && !isisBranchProductsFetched}
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
				scroll={{ x: 1600 }}
				bordered
				onChange={(_pagination, _filters, sorter: SorterResult<any>, extra) => {
					if (extra.action === 'sort') {
						columns[2].sortOrder = null;
						columns[4].sortOrder = null;
						columns[5].sortOrder = null;
						columns[6].sortOrder = null;
						// eslint-disable-next-line no-param-reassign
						sorter.column.sortOrder = sorter.order;

						setQueryParams(
							{ ordering: getSortOrder(sorter.field, sorter.order) },
							{ shouldResetPage: true },
						);
					}
				}}
			/>

			{selectedBranchProduct && (
				<EditBranchProductsModal
					branchProduct={selectedBranchProduct}
					onClose={() => setSelectedBranchProduct(null)}
				/>
			)}
		</div>
	);
};

interface FilterProps {
	productCategories: IProductCategory[];
}

const Filter = ({ productCategories }: FilterProps) => {
	// STATES
	const [productOptions, setProductOptions] = useState([]);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [searchKeyword, setSearchKeyword] = useState('');

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { products },
		isFetching: isFetchingProducts,
	} = useProducts({
		params: { search: searchKeyword || undefined },
	});
	const {
		data: { products: paramProducts },
		isFetching: isFetchingParamProducts,
	} = useProducts({
		params: { ids: params?.productIds },
		options: { enabled: selectedProducts.length === 0 },
	});

	// METHODS
	useEffect(() => {
		setProductOptions(
			products.map((product) => ({
				label: product.name,
				value: product.id,
			})),
		);
	}, [products]);

	useEffect(() => {
		const productIds = _.toString(params.productIds)
			.split(',')
			.map((id) => Number(id));
		const options = paramProducts
			.filter((product) => productIds.includes(product.id))
			.map((product) => ({
				label: product.name,
				value: product.id,
			}));

		setSelectedProducts(options);
	}, [paramProducts]);

	const handleSearchDebounced = useCallback(
		_.debounce((keyword) => {
			setProductOptions([]);
			setSearchKeyword(keyword.toLowerCase());
		}, SEARCH_DEBOUNCE_TIME),
		[params],
	);

	return (
		<Row className="pa-6" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Product Name" spacing />
				<Select
					className="w-100"
					filterOption={false}
					mode="multiple"
					notFoundContent={
						isFetchingProducts || isFetchingParamProducts ? (
							<Spin size="small" />
						) : null
					}
					options={productOptions}
					value={selectedProducts}
					labelInValue
					onChange={(values) => {
						setSelectedProducts(values);
						setQueryParams(
							{ productIds: values.map(({ value }) => value).join(',') },
							{ shouldResetPage: true },
						);
					}}
					onSearch={handleSearchDebounced}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Product Category" spacing />
				<Select
					className="w-100"
					defaultValue={params.productCategory}
					filterOption={filterOption}
					optionFilterProp="children"
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
				<Label label="Product Status" spacing />
				<Select
					className="w-100"
					filterOption={filterOption}
					optionFilterProp="children"
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ productStatus: value }, { shouldResetPage: true });
					}}
				>
					<Select.Option value={productStatus.AVAILABLE}>
						Available
					</Select.Option>
					<Select.Option value={productStatus.REORDER}>Reorder</Select.Option>
					<Select.Option value={productStatus.OUT_OF_STOCK}>
						Out of Stock
					</Select.Option>
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<TimeRangeFilter />
			</Col>

			<Col lg={12} span={24}>
				<Label label="Show Sold In Branch" spacing />
				<Radio.Group
					defaultValue={params.isSoldInBranch}
					options={[
						{ label: 'Show All', value: ALL_OPTION_KEY },
						{ label: 'In Stock', value: '1' },
					]}
					optionType="button"
					value={params.isSoldInBranch}
					onChange={(e) => {
						setQueryParams(
							{ isSoldInBranch: e.target.value },
							{ shouldResetPage: true },
						);
					}}
				/>
			</Col>

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
						setQueryParams(
							{ hasBoBalance: e.target.value },
							{ shouldResetPage: true },
						);
					}}
				/>
			</Col>
		</Row>
	);
};
