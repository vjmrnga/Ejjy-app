import { SearchOutlined } from '@ant-design/icons';
import { Col, Divider, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CashieringCard } from '../../../../components/CashieringCard/CashieringCard';
import { Label } from '../../../../components/elements';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { RequestWarnings } from '../../../../components/RequestWarnings/RequestWarnings';
import { IS_APP_LIVE } from '../../../../global/constants';
import {
	branchProductStatusOptions,
	pageSizeOptions,
} from '../../../../global/options';
import { request } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useBranchesDays } from '../../../../hooks/useBranchesDays';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { IProductCategory } from '../../../../models';
import {
	convertIntoArray,
	getBranchProductStatus,
} from '../../../../utils/function';

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
	productCategories: IProductCategory[];
	disabled: boolean;
	isActive: boolean;
}

export const BranchBalanceItem = ({
	productCategories,
	branchId,
	isActive,
	disabled,
}: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [searchedKeyword, setSearchedKeyword] = useState('');
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);
	const [productCategory, setProductCategory] = useState(null);
	const [status, setStatus] = useState(null);

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
			fetchBranchProducts({}, 1, pageSize);
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

	const onSearch = useCallback(
		debounce((keyword) => {
			const lowerCaseKeyword = keyword?.toLowerCase();
			fetchBranchProducts(
				{
					search: searchedKeyword,
					productCategory,
					status: branchProductsStatus,
				},
				1,
				pageSize,
			);
			setSearchedKeyword(lowerCaseKeyword);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	const onPageChange = (page, newPageSize) => {
		fetchBranchProducts(
			{
				search: searchedKeyword,
				productCategory,
				status,
			},
			page,
			newPageSize,
		);
	};

	const onSelectProductCategory = (value) => {
		setProductCategory(value);

		fetchBranchProducts(
			{
				search: searchedKeyword,
				productCategory: value,
				status,
			},
			1,
			pageSize,
		);
	};

	const onSelectStatus = (value) => {
		setStatus(value);

		fetchBranchProducts(
			{
				search: searchedKeyword,
				productCategory,
				status: value,
			},
			1,
			pageSize,
		);
	};

	const fetchBranchProducts = (params, page, newPageSize) => {
		getBranchProducts(
			{ ...params, branchId, page, pageSize: newPageSize },
			true,
		);

		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			getBranchProducts(
				{ ...params, branchId, page, pageSize: newPageSize },
				true,
			);
		}, INTERVAL_MS);
	};

	return (
		<div className="BranchBalanceItem">
			<BranchDay branchId={branchId} isActive={isActive} disabled={disabled} />

			<Divider dashed />

			<BranchBalanceItemFilter
				productCategories={productCategories}
				onSearch={onSearch}
				onSelectStatus={onSelectStatus}
				onSelectProductCategory={onSelectProductCategory}
			/>

			<RequestErrors
				errors={convertIntoArray(branchProductsErrors, 'Branch Product')}
				withSpaceBottom
			/>

			<RequestWarnings
				warnings={convertIntoArray(branchProductsWarnings, 'Branch Product')}
				withSpaceBottom
			/>

			<Table
				className="TableNoPadding BranchBalanceItem_table"
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
					isCompletedInitialFetch
						? false
						: branchProductsStatus === request.REQUESTING
				}
			/>
		</div>
	);
};

interface BranchBalanceItemFilterProps {
	productCategories: IProductCategory[];
	onSearch: any;
	onSelectStatus: any;
	onSelectProductCategory: any;
}

const BranchBalanceItemFilter = ({
	productCategories,
	onSearch,
	onSelectStatus,
	onSelectProductCategory,
}: BranchBalanceItemFilterProps) => (
	<Row gutter={[15, 15]}>
		<Col lg={12} span={24}>
			<Label label="Search" spacing />
			<Input
				prefix={<SearchOutlined />}
				onChange={(event) => onSearch(event.target.value.trim())}
			/>
		</Col>

		<Col lg={12} span={24}>
			<Label label="Category" spacing />
			<Select
				style={{ width: '100%' }}
				onChange={(value) => {
					onSelectProductCategory(value);
				}}
				allowClear
			>
				{productCategories.map(({ name }) => (
					<Select.Option value={name}>{name}</Select.Option>
				))}
			</Select>
		</Col>

		<Col lg={12} span={24}>
			<Label label="Status" spacing />
			<Select
				style={{ width: '100%' }}
				onChange={(value) => {
					onSelectStatus(value);
				}}
				allowClear
			>
				{branchProductStatusOptions.map(({ name, value }) => (
					<Select.Option value={value}>{name}</Select.Option>
				))}
			</Select>
		</Col>
	</Row>
);

interface BranchDayProps {
	branchId: number;
	isActive: boolean;
	disabled: boolean;
}

const BranchDay = ({ branchId, isActive, disabled }: BranchDayProps) => {
	// STATES
	const [branchDay, setBranchDay] = useState(null);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		branchDay: latestBranchDay,
		getBranchDay,
		createBranchDay,
		editBranchDay,
		status: branchesDaysStatus,
		errors: branchesDaysErrors,
		warnings: branchesDaysWarnings,
	} = useBranchesDays();

	// METHODS
	useEffect(() => {
		if (isActive) {
			getBranchDay(branchId);
		}
	}, [isActive]);

	useEffect(() => {
		if (latestBranchDay && dayjs(latestBranchDay.datetime_created)?.isToday()) {
			setBranchDay(latestBranchDay);
		}
	}, [latestBranchDay]);

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

	return (
		<>
			<RequestErrors
				errors={convertIntoArray(branchesDaysErrors, 'Branch Day')}
				withSpaceBottom
			/>

			<RequestWarnings
				warnings={convertIntoArray(branchesDaysWarnings, 'Branch Day')}
				withSpaceBottom
			/>

			<CashieringCard
				classNames="BranchBalanceItem_cashieringCard"
				branchDay={branchDay}
				onConfirm={branchDay ? onEndDay : onStartDay}
				loading={branchesDaysStatus === request.REQUESTING}
				disabled={disabled}
				bordered
			/>
		</>
	);
};
