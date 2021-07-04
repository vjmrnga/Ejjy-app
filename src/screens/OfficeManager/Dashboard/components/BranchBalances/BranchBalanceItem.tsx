import { Divider, message, Table } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { CashieringCard } from '../../../../../components/CashieringCard/CashieringCard';
import SearchInput from '../../../../../components/elements/SearchInput/SearchInput';
import { selectors as authSelectors } from '../../../../../ducks/auth';
import { IS_APP_LIVE } from '../../../../../global/constants';
import { pageSizeOptions } from '../../../../../global/options';
import { request } from '../../../../../global/types';
import { useBranchesDays } from '../../../../../hooks/useBranchesDays';
import { useBranchProducts } from '../../../../../hooks/useBranchProducts';
import { getBranchProductStatus } from '../../../../../utils/function';

const columns = [
	{ title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{
		title: 'Balance',
		dataIndex: 'balance',
		key: 'balance',
		align: 'center' as 'center',
	},
	{ title: 'Status', dataIndex: 'status', key: 'status' },
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
	const [branchDay, setBranchDay] = useState(null);
	const [searchedKeyword, setSearchedKeyword] = useState('');
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);

	// CUSTOM HOOKS
	const {
		branchDay: latestBranchDay,
		getBranchDay,
		createBranchDay,
		editBranchDay,
		status: branchesDaysStatus,
		errors: branchesDaysErrors,
	} = useBranchesDays();
	const {
		branchProducts,
		pageCount,
		pageSize,
		currentPage,
		getBranchProducts,
		status,
	} = useBranchProducts();
	const user = useSelector(authSelectors.selectUser());

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
			const { product, max_balance, current_balance, product_status } =
				branchProduct;
			const { barcode, name, textcode } = product;

			return {
				barcode: barcode || textcode,
				name,
				balance: `${current_balance} / ${max_balance}`,
				status: getBranchProductStatus(product_status),
			};
		});

		setData(newBranchProducts);
	}, [branchProducts]);

	useEffect(() => {
		if (latestBranchDay && dayjs(latestBranchDay.datetime_created)?.isToday()) {
			setBranchDay(latestBranchDay);
		}
	}, [latestBranchDay]);

	// Effect: Display errors from branch cashiering
	useEffect(() => {
		if (branchesDaysErrors?.length && branchesDaysStatus === request.ERROR) {
			message.error(branchesDaysErrors);
		}
	}, [branchesDaysErrors, branchesDaysStatus]);

	const onStartDay = () => {
		const onlineStartedById = IS_APP_LIVE ? user.id : null;
		const startedById = IS_APP_LIVE ? null : user.id;
		createBranchDay(branchId, startedById, onlineStartedById);
	};

	const onEndDay = () => {
		const onlineEndedById = IS_APP_LIVE ? user.id : null;
		const endedById = IS_APP_LIVE ? null : user.id;
		editBranchDay(branchId, branchDay.id, endedById, onlineEndedById);
	};

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
		getBranchProducts({ search, branchId, page, pageSize: newPageSize }, true);

		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			getBranchProducts(
				{ search, branchId, page, pageSize: newPageSize },
				true,
			);
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

			<Table
				className="table-no-padding"
				columns={columns}
				dataSource={data}
				scroll={{ x: 600 }}
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
