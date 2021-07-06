import { Col, DatePicker, Radio, Row, Select, Space, Spin, Table } from 'antd';
import { ColumnsType, SorterResult } from 'antd/lib/table/interface';
import { Label } from 'components/elements';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { RequestWarnings } from 'components/RequestWarnings/RequestWarnings';
import debounce from 'lodash/debounce';
import React, { useEffect, useRef, useState } from 'react';
import { pageSizeOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useProducts } from '../../../../hooks/useProducts';
import {
	convertIntoArray,
	getBranchProductStatus,
} from '../../../../utils/function';

const { Option } = Select;
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
	if (!order) {
		return null;
	}

	if (column === 'balance') {
		return order === 'ascend' ? 'current_balance' : '-current_balance';
	} else if (column === 'quantity_sold') {
		return order === 'ascend' ? 'quantity_sold' : '-quantity_sold';
	} else if (column === 'daily_average_sold') {
		return order === 'ascend' ? 'daily_average_sold' : '-daily_average_sold';
	} else if (column === 'daily_average_sold_percentage') {
		return order === 'ascend'
			? 'daily_average_sold_percentage'
			: '-daily_average_sold_percentage';
	}
};

interface Props {
	branchId: number;
	isActive: boolean;
}

export const BranchBalanceItem = ({ isActive, branchId }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [tags, setTags] = useState('');
	const [timeRange, setTimeRange] = useState('daily');
	const [timeRangeOption, setTimeRangeOption] = useState('daily');
	const [sorting, setSorting] = useState(null);
	const [productCategory, setProductCategory] = useState(null);
	const [productOptions, setProductOptions] = useState([]);
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);

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
			fetchBranchProducts(null, null, null, 'daily', 1, pageSize);
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
			const { barcode, name, textcode } = product;
			const remainingBalance =
				(Number(current_balance) / Number(max_balance)) * 100;

			return {
				barcode: barcode || textcode,
				name,
				balance: `${current_balance} / ${max_balance}`,
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
		sorting,
		productCategory,
		timeRange,
		page,
		newPageSize,
	) => {
		getBranchProductsWithAnalytics(
			{
				branchId,
				productIds: productIds?.length ? productIds : null,
				sorting,
				productCategory,
				timeRange,
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
		<div className="BranchBalanceItem">
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

							fetchBranchProducts(tags, sorting, value, timeRange, 1, pageSize);
						}}
						allowClear
					>
						<Option value="baboy">Baboy</Option>
						<Option value="manok">Manok</Option>
						<Option value="assorted">Assorted</Option>
						<Option value="gulay">Gulay</Option>
						<Option value="hotdog">Hotdog</Option>
					</Select>
				</Col>
				<Col lg={12} span={24}>
					<Space direction="vertical" size={15}>
						<Label label="Quantity Sold Date" />
						<Radio.Group
							options={[
								{ label: 'Daily', value: 'daily' },
								{ label: 'Monthly', value: 'monthly' },
								{ label: 'Select Date Range', value: 'date_range' },
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
											1,
											pageSize,
										);
									}
								}}
							/>
						)}
					</Space>
				</Col>
			</Row>

			<Table
				className="table table-no-padding "
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
