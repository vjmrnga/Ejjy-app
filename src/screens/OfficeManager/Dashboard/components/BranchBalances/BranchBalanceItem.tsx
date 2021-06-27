/* eslint-disable react-hooks/exhaustive-deps */
import { Divider, message, Pagination } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { TableNormal } from '../../../../../components';
import { CashieringCard } from '../../../../../components/CashieringCard/CashieringCard';
import SearchInput from '../../../../../components/elements/SearchInput/SearchInput';
import { selectors as authSelectors } from '../../../../../ducks/auth';
import { IS_APP_LIVE } from '../../../../../global/constants';
import { request } from '../../../../../global/types';
import { useBranchesDays } from '../../../../../hooks/useBranchesDays';
import { useBranchProducts } from '../../../../../hooks/useBranchProducts';
import { getBranchProductStatus } from '../../../../../utils/function';

const columns = [
	{ name: 'Barcode' },
	{ name: 'Name' },
	{ name: 'Balance', center: true },
	{ name: 'Remaining Bal', center: true },
	{ name: 'Daily Qty', center: true },
	{ name: 'Weekly Ave. Sold', center: true },
	{ name: 'Status' },
];

const INTERVAL_MS = 30000;
const SEARCH_DEBOUNCE_TIME = 500;

interface Props {
	branchId: number;
	disabled: boolean;
	isActive: boolean;
}

export const BranchBalanceItem = ({ isActive, branchId, disabled }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [searchedKeyword, setSearchedKeyword] = useState('');
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);

	// CUSTOM HOOKS
	const {
		branchDay,
		getBranchDay,
		createBranchDay,
		editBranchDay,
		status: branchesDaysStatus,
		errors: branchesDaysErrors,
	} = useBranchesDays();
	const { branchProducts, pageCount, pageSize, currentPage, getBranchProducts, status } =
		useBranchProducts();
	const user = useSelector(authSelectors.selectUser());

	// REFS
	const intervalRef = useRef(null);

	// METHODS

	useEffect(() => {
		if (isActive) {
			getBranchDay(branchId);
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
				daily_quantity_sold,
				average_item_sold_percentage_per_week = '0.00',
			} = branchProduct;
			const { barcode, name, textcode } = product;

			const remainingBalance = (Number(current_balance) / Number(max_balance)) * 100;

			return [
				{ isHidden: true, barcode, name, textcode },
				barcode || textcode,
				name,
				`${current_balance} / ${max_balance}`,
				`${remainingBalance.toFixed(2)}%`,
				daily_quantity_sold,
				`${average_item_sold_percentage_per_week}%`,
				getBranchProductStatus(product_status),
			];
		});

		setData(newBranchProducts);
	}, [branchProducts]);

	// Effect: Display errors from branch cashiering
	useEffect(() => {
		if (branchesDaysErrors?.length && branchesDaysStatus === request.ERROR) {
			message.error(branchesDaysErrors);
		}
	}, [branchesDaysErrors, branchesDaysStatus]);

	const onStartDay = () => {
		const onlineStartedById = IS_APP_LIVE ? user.id : null;
		createBranchDay(branchId, user.id, onlineStartedById);
	};

	const onEndDay = () => {
		const onlineStartedById = IS_APP_LIVE ? user.id : null;
		editBranchDay(branchId, branchDay.id, user.id, onlineStartedById);
	};

	const onSearch = useCallback(
		debounce((keyword) => {
			keyword = keyword?.toLowerCase();
			setSearchedKeyword(keyword);
			fetchBranchProducts(keyword, 1, pageSize);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	const onPageChange = (page, newPageSize) => {
		fetchBranchProducts(searchedKeyword, page, newPageSize);
	};

	const fetchBranchProducts = (search, page, pageSize) => {
		getBranchProducts({ search, branchId, page, pageSize }, true);

		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			getBranchProducts({ search, branchId, page, pageSize }, true);
		}, INTERVAL_MS);
	};

	return (
		<>
			<CashieringCard
				classNames="bordered cashiering-card-office"
				branchDay={branchDay}
				onConfirm={branchDay ? onEndDay : onStartDay}
				loading={branchesDaysStatus === request.REQUESTING}
				disabled={disabled}
			/>

			<Divider dashed />

			<SearchInput
				classNames="tab-search-input"
				placeholder="Search product"
				onChange={(event) => onSearch(event.target.value.trim())}
			/>
			<TableNormal
				columns={columns}
				data={data}
				loading={isCompletedInitialFetch ? false : status === request.REQUESTING}
			/>

			<Pagination
				className="table-pagination"
				current={currentPage}
				total={pageCount}
				pageSize={pageSize}
				onChange={onPageChange}
				disabled={!data}
			/>
		</>
	);
};
