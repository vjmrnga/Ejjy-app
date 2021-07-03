import { Select, Table } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchInput from '../../../../components/elements/SearchInput/SearchInput';
import { pageSizeOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { getBranchProductStatus } from '../../../../utils/function';

const columns = [
	{
		title: 'Barcode',
		dataIndex: 'barcode',
		key: 'barcode',
		width: 100,
		fixed: 'left' as 'left',
	},
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		width: 150,
		fixed: 'left' as 'left',
	},
	{
		title: 'Balance',
		dataIndex: 'balance',
		key: 'balance',
		align: 'center' as 'center',
	},
	{
		title: 'Remaining Bal',
		dataIndex: 'remaining_balance',
		key: 'remaining_balance',
		align: 'center' as 'center',
	},
	{
		title: 'Quantity Sold',
		dataIndex: 'quantity_sold',
		key: 'quantity_sold',
		align: 'center' as 'center',
	},
	{
		title: 'Daily Average Sold',
		dataIndex: 'daily_average_sold',
		key: 'daily_average_sold',
		align: 'center' as 'center',
	},
	{
		title: 'Daily Average Sold Percentage',
		dataIndex: 'daily_average_sold_percentage',
		key: 'daily_average_sold_percentage',
		align: 'center' as 'center',
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		width: 100,
		fixed: 'right' as 'right',
	},
];

const INTERVAL_MS = 30000;
const SEARCH_DEBOUNCE_TIME = 500;

interface Props {
	branchId: number;
	isActive: boolean;
}

export const BranchBalanceItem = ({ isActive, branchId }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [searchedKeyword, setSearchedKeyword] = useState('');
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);

	// CUSTOM HOOKS
	const {
		branchProducts,
		pageCount,
		pageSize,
		currentPage,
		getBranchProductsWithAnalytics,
		status,
	} = useBranchProducts();

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
			fetchBranchProducts(searchedKeyword, 1, pageSize);
		} else {
			clearInterval(intervalRef.current);
		}
	}, [isActive]);

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

	const onSearch = useCallback(
		debounce((keyword) => {
			const lowerCaseKeyword = keyword?.toLowerCase();
			setSearchedKeyword(lowerCaseKeyword);
			fetchBranchProducts(lowerCaseKeyword, 1, pageSize);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	const onPageChange = (page, newPageSize) => {
		fetchBranchProducts(searchedKeyword, page, newPageSize);
	};

	const fetchBranchProducts = (search, page, newPageSize) => {
		getBranchProductsWithAnalytics(
			{ search, branchId, page, pageSize: newPageSize },
			true,
		);

		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			getBranchProductsWithAnalytics(
				{ search, branchId, page, pageSize: newPageSize },
				true,
			);
		}, INTERVAL_MS);
	};

	return (
		<>
			<Select
				mode="tags"
				style={{ width: '100%' }}
				placeholder="Tags Mode"
				onChange={(value) => {
					console.log('value', value);
				}}
				open={false}
			/>

			<SearchInput
				classNames="tab-search-input"
				placeholder="Search product"
				onChange={(event) => onSearch(event.target.value.trim())}
			/>

			<Table
				columns={columns}
				dataSource={data}
				scroll={{ x: 1100 }}
				pagination={{
					current: currentPage,
					total: pageCount,
					pageSize,
					onChange: onPageChange,
					disabled: !data,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				loading={
					isCompletedInitialFetch ? false : status === request.REQUESTING
				}
			/>
		</>
	);
};
