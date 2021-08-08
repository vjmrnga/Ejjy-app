import { Col, DatePicker, Radio, Row, Select, Spin, Table } from 'antd';
import { ColumnsType, SorterResult } from 'antd/lib/table/interface';
import debounce from 'lodash/debounce';
import React, { useEffect, useRef, useState } from 'react';
import { Label } from '../../../../components/elements';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { RequestWarnings } from '../../../../components/RequestWarnings/RequestWarnings';
import { pageSizeOptions } from '../../../../global/options';
import { request, timeRangeTypes } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useProducts } from '../../../../hooks/useProducts';
import { IProductCategory } from '../../../../models';
import {
	convertIntoArray,
	formatBalance,
	getBranchProductStatus,
} from '../../../../utils/function';

const { RangePicker } = DatePicker;

const columns: ColumnsType = [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		width: 150,
		fixed: 'left',
	},
	{
		title: 'Barcode',
		dataIndex: 'barcode',
		key: 'barcode',
	},
	{
		title: 'Balance',
		dataIndex: 'balance',
		key: 'balance',
		align: 'center',
		sorter: true,
	},
	{
		title: 'Remaining Bal',
		dataIndex: 'remaining_balance',
		key: 'remaining_balance',
		align: 'center',
	},
	{
		title: 'Quantity Sold',
		dataIndex: 'quantity_sold',
		key: 'quantity_sold',
		align: 'center',
		sorter: true,
	},
	{
		title: 'Daily Average Sold',
		dataIndex: 'daily_average_sold',
		key: 'daily_average_sold',
		align: 'center',
		sorter: true,
	},
	{
		title: 'Average Quantity Sold Percentage',
		dataIndex: 'daily_average_sold_percentage',
		key: 'daily_average_sold_percentage',
		align: 'center',
		sorter: true,
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
	},
];

const INTERVAL_MS = 30000;
const SEARCH_DEBOUNCE_TIME = 1000;

const getSorting = (column, order) => {
	let sorting = null;

	if (!order) {
		return sorting;
	}

	if (column === 'balance') {
		sorting = order === 'ascend' ? 'current_balance' : '-current_balance';
	} else if (column === 'quantity_sold') {
		sorting = order === 'ascend' ? 'quantity_sold' : '-quantity_sold';
	} else if (column === 'daily_average_sold') {
		sorting = order === 'ascend' ? 'daily_average_sold' : '-daily_average_sold';
	} else if (column === 'daily_average_sold_percentage') {
		sorting =
			order === 'ascend'
				? 'daily_average_sold_percentage'
				: '-daily_average_sold_percentage';
	}

	return sorting;
};

interface Props {
	branchId: number;
	productCategories: IProductCategory[];
	isActive: boolean;
}

export const ReportsBranch = ({
	isActive,
	branchId,
	productCategories,
}: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [tags, setTags] = useState('');
	const [timeRange, setTimeRange] = useState(timeRangeTypes.DAILY);
	const [timeRangeOption, setTimeRangeOption] = useState(timeRangeTypes.DAILY);
	const [sorting, setSorting] = useState(null);
	const [productCategory, setProductCategory] = useState(null);
	const [productOptions, setProductOptions] = useState([]);
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);
	const [showSoldOnly, setShowSoldOnly] = useState(true);

	// CUSTOM HOOKS
	const {
		branchProducts,
		pageCount,
		pageSize,
		currentPage,
		getBranchProductsWithAnalytics,
		status: branchProductsStatus,
		errors,
		warnings,
	} = useBranchProducts();
	const { products, getProducts, status: productsStatus } = useProducts();

	// REFS
	const intervalRef = useRef(null);

	// METHODS
	useEffect(
		() => () => {
			// Cleanup in case logged out due to single sign on
			clearInterval(intervalRef.current);
		},
		[],
	);

	useEffect(() => {
		if (isActive) {
			fetchBranchProducts(
				null,
				null,
				null,
				timeRangeTypes.DAILY,
				showSoldOnly,
				1,
				pageSize,
			);
		} else {
			clearInterval(intervalRef.current);
		}
	}, [isActive]);

	useEffect(() => {
		setProductOptions(
			products.map((product) => ({
				label: product.name,
				value: product.id,
			})),
		);
	}, [products]);

	useEffect(() => {
		if (!isCompletedInitialFetch && branchProducts.length) {
			setIsCompletedInitialFetch(true);
		}

		const newBranchProducts = branchProducts?.map((branchProduct) => {
			const {
				product,
				max_balance,
				current_balance,
				product_status,
				quantity_sold,
				daily_average_sold,
				daily_average_sold_percentage,
			} = branchProduct;
			const { barcode, name, textcode, unit_of_measurement } = product;
			const remainingBalance =
				(Number(current_balance) / Number(max_balance)) * 100;

			const currentBalance = formatBalance(
				unit_of_measurement,
				current_balance,
			);

			const maxBalance = formatBalance(unit_of_measurement, max_balance);

			return {
				barcode: barcode || textcode,
				name,
				balance: `${currentBalance} / ${maxBalance}`,
				remaining_balance: `${remainingBalance.toFixed(2)}%`,
				quantity_sold,
				daily_average_sold,
				daily_average_sold_percentage: `${daily_average_sold_percentage}%`,
				status: getBranchProductStatus(product_status),
			};
		});

		setData(newBranchProducts);
	}, [branchProducts]);

	const fetchBranchProducts = (
		productIds,
		sort,
		category,
		range,
		hasBeenSoldOnly,
		page,
		newPageSize,
	) => {
		getBranchProductsWithAnalytics(
			{
				branchId,
				productIds: productIds?.length ? productIds : null,
				sorting: sort,
				productCategory: category,
				timeRange: range,
				hasBeenSoldOnly,
				page,
				pageSize: newPageSize,
			},
			true,
		);

		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			getBranchProductsWithAnalytics(
				{
					branchId,
					productIds: productIds?.length ? productIds : null,
					sorting,
					productCategory,
					timeRange,
					hasBeenSoldOnly,
					page,
					pageSize: newPageSize,
				},
				true,
			);
		}, INTERVAL_MS);
	};

	const debounceFetchProducts = React.useMemo(() => {
		const loadOptions = (value: string) => {
			setProductOptions([]);

			getProducts(
				{
					search: value.toLowerCase(),
					page: 1,
					pageSize: 500,
				},
				true,
			);
		};

		return debounce(loadOptions, SEARCH_DEBOUNCE_TIME);
	}, [SEARCH_DEBOUNCE_TIME]);

	return (
		<div className="ReportsBranch">
			<RequestErrors
				errors={convertIntoArray(errors, 'Branch Product')}
				withSpaceBottom
			/>

			<RequestWarnings
				warnings={convertIntoArray(warnings, 'Branch Product')}
				withSpaceBottom
			/>

			<Row gutter={[15, 15]}>
				<Col lg={12} span={24}>
					<Label label="Product Name" spacing />
					<Select
						mode="multiple"
						style={{ width: '100%' }}
						filterOption={false}
						onSearch={debounceFetchProducts}
						notFoundContent={
							productsStatus === request.REQUESTING ? (
								<Spin size="small" />
							) : null
						}
						options={productOptions}
						onChange={(value: string[]) => {
							const joinedValue = value.join(',');
							setTags(joinedValue);
							setIsCompletedInitialFetch(false);

							fetchBranchProducts(
								joinedValue,
								sorting,
								productCategory,
								timeRange,
								showSoldOnly,
								1,
								pageSize,
							);
						}}
					/>
				</Col>
				<Col lg={12} span={24}>
					<Label label="Product Category" spacing />
					<Select
						style={{ width: '100%' }}
						onChange={(value) => {
							setProductCategory(value);
							setIsCompletedInitialFetch(false);

							fetchBranchProducts(
								tags,
								sorting,
								value,
								timeRange,
								showSoldOnly,
								1,
								pageSize,
							);
						}}
						allowClear
					>
						{productCategories.map(({ name }) => (
							<Select.Option value={name}>{name}</Select.Option>
						))}
					</Select>
				</Col>
				<Col lg={12} span={24}>
					<Label label="Quantity Sold Date" spacing />
					<Radio.Group
						options={[
							{ label: 'Daily', value: timeRangeTypes.DAILY },
							{ label: 'Monthly', value: timeRangeTypes.MONTHLY },
							{
								label: 'Select Date Range',
								value: timeRangeTypes.DATE_RANGE,
							},
						]}
						onChange={(e) => {
							const { value } = e.target;
							setTimeRange(value);
							setTimeRangeOption(value);

							if (value !== 'date_range') {
								setIsCompletedInitialFetch(false);
								fetchBranchProducts(
									tags,
									sorting,
									productCategory,
									value,
									showSoldOnly,
									1,
									pageSize,
								);
							}
						}}
						defaultValue="daily"
						optionType="button"
					/>
					{timeRangeOption === 'date_range' && (
						<RangePicker
							format="MM/DD/YY"
							onCalendarChange={(dates, dateStrings) => {
								if (dates?.[0] && dates?.[1]) {
									const value = dateStrings.join(',');
									setTimeRange(value);
									setIsCompletedInitialFetch(false);

									fetchBranchProducts(
										tags,
										sorting,
										productCategory,
										value,
										showSoldOnly,
										1,
										pageSize,
									);
								}
							}}
						/>
					)}
				</Col>
				<Col lg={12} span={24}>
					<Label label="Show Sold In Branch" spacing />
					<Radio.Group
						options={[
							{ label: 'Show All', value: false },
							{ label: 'In Stock', value: true },
						]}
						onChange={(e) => {
							const { value } = e.target;
							setShowSoldOnly(value);

							fetchBranchProducts(
								tags,
								sorting,
								productCategory,
								timeRange,
								value,
								1,
								pageSize,
							);
						}}
						// eslint-disable-next-line react/jsx-boolean-value
						defaultValue={true}
						optionType="button"
					/>
				</Col>
			</Row>

			<Table
				className="ReportsBranch_table TableNoPadding"
				columns={columns}
				dataSource={data}
				scroll={{ x: 1200 }}
				pagination={{
					current: currentPage,
					total: pageCount,
					pageSize,
					position: ['bottomCenter'],
					onChange: (page, newPageSize) => {
						setIsCompletedInitialFetch(false);
						fetchBranchProducts(
							'',
							sorting,
							productCategory,
							timeRange,
							showSoldOnly,
							page,
							newPageSize,
						);
					},
					disabled: !data,
					pageSizeOptions,
				}}
				onChange={(_pagination, _filters, sorter: SorterResult<any>, extra) => {
					if (extra.action === 'sort') {
						const value = getSorting(sorter.columnKey, sorter.order);
						setSorting(value);
						setIsCompletedInitialFetch(false);

						fetchBranchProducts(
							tags,
							value,
							productCategory,
							timeRange,
							showSoldOnly,
							currentPage,
							pageSize,
						);
					}
				}}
				loading={
					isCompletedInitialFetch
						? false
						: branchProductsStatus === request.REQUESTING
				}
			/>
		</div>
	);
};
