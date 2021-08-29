import { SearchOutlined } from '@ant-design/icons';
import { Col, Divider, Input, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ColoredText } from '../../../../components';
import { CashieringCard } from '../../../../components/CashieringCard/CashieringCard';
import { FieldError, Label } from '../../../../components/elements';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { RequestWarnings } from '../../../../components/RequestWarnings/RequestWarnings';
import { SEARCH_DEBOUNCE_TIME, EMPTY_CELL } from '../../../../global/constants';
import {
	branchProductStatusOptions,
	pageSizeOptions,
} from '../../../../global/options';
import { request, requisitionSlipTypes } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useNetwork } from '../../../../hooks/useNetwork';
import { IProductCategory } from '../../../../models';
import {
	convertIntoArray,
	formatBalance,
	formatDateTime,
	getBranchProductStatus,
} from '../../../../utils/function';

const columns: ColumnsType = [
	{ title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{
		title: 'Balance',
		dataIndex: 'balance',
		key: 'balance',
		align: 'center',
	},
	{ title: 'Status', dataIndex: 'status', key: 'status' },
	{
		title: 'Requisition Slip',
		children: [
			{
				title: 'Delivery Date',
				dataIndex: 'deliveryDate',
				key: 'deliveryDate',
				align: 'center',
			},
			{
				title: 'Type',
				dataIndex: 'type',
				key: 'type',
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
	const [productStatus, setProductStatus] = useState(null);
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

	// REFS
	const fetchIntervalRef = useRef(null);
	const networkIntervalRef = useRef(null);

	// METHODS
	useEffect(
		() => () => {
			// Cleanup in case logged out due to single sign on
			clearInterval(fetchIntervalRef.current);
		},
		[],
	);

	useEffect(() => {
		if (isActive) {
			fetchBranchProducts({}, 1, pageSize);

			const fn = () => {
				testBranchConnection({ branchId }, ({ status }) => {
					if (status === request.SUCCESS) {
						setHasInternetConnection(true);
					} else if (status === request.ERROR) {
						setHasInternetConnection(false);
					}
				});
			};
			fn();
			networkIntervalRef.current = setInterval(fn, NETWORK_INTERVAL_MS);
		} else {
			clearInterval(fetchIntervalRef.current);
			clearInterval(networkIntervalRef.current);
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
				latest_requisition_slip,
			} = branchProduct;
			const { barcode, name, textcode, unit_of_measurement } = product;
			const { datetime_created, type } = latest_requisition_slip || {};

			const currentBalance = formatBalance(
				unit_of_measurement,
				current_balance,
			);

			const maxBalance = formatBalance(unit_of_measurement, max_balance);

			return {
				barcode: barcode || textcode,
				name,
				balance: `${currentBalance} / ${maxBalance}`,
				status: getBranchProductStatus(product_status),
				deliveryDate: datetime_created
					? formatDateTime(datetime_created)
					: EMPTY_CELL,
				type: type ? renderRsType(type) : EMPTY_CELL,
			};
		});

		setData(newBranchProducts);
	}, [branchProducts]);

	const onPageChange = (page, newPageSize) => {
		fetchBranchProducts(
			{
				search: searchedKeyword,
				productCategory,
				productStatus,
			},
			page,
			newPageSize,
		);
	};

	const onSearch = useCallback(
		debounce((keyword) => {
			const lowerCaseKeyword = keyword?.toLowerCase();
			setSearchedKeyword(lowerCaseKeyword);

			fetchBranchProducts(
				{
					search: lowerCaseKeyword,
					productCategory,
					productStatus,
				},
				1,
				pageSize,
			);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	const onSelectProductCategory = (value) => {
		setProductCategory(value);

		fetchBranchProducts(
			{
				search: searchedKeyword,
				productCategory: value,
				productStatus,
			},
			1,
			pageSize,
		);
	};

	const onSelectProductStatus = (value) => {
		setProductStatus(value);

		fetchBranchProducts(
			{
				search: searchedKeyword,
				productCategory,
				productStatus: value,
			},
			1,
			pageSize,
		);
	};

	const fetchBranchProducts = (params, page, newPageSize) => {
		setIsCompletedInitialFetch(false);
		getBranchProducts(
			{ ...params, branchId, page, pageSize: newPageSize },
			true,
		);

		clearInterval(fetchIntervalRef.current);
		fetchIntervalRef.current = setInterval(() => {
			getBranchProducts(
				{ ...params, branchId, page, pageSize: newPageSize },
				true,
			);
		}, FETCH_INTERVAL_MS);
	};

	const renderRsType = (type) => {
		let component = null;

		if (requisitionSlipTypes.AUTOMATIC === type) {
			component = <ColoredText variant="primary" text="Automatic" />;
		} else if (requisitionSlipTypes.MANUAL === type) {
			component = <ColoredText variant="secondary" text="Out of Stock" />;
		}

		return component;
	};

	return (
		<div className="BranchBalanceItem">
			{hasInternetConnection === false && (
				<FieldError error="Cannot reach branch's API" />
			)}
			{isActive && (
				<CashieringCard
					branchId={branchId}
					className="BranchBalanceItem_cashieringCard"
					disabled={disabled || !hasInternetConnection}
					bordered
				/>
			)}

			<Divider dashed />

			<Filter
				productCategories={productCategories}
				onSearch={onSearch}
				onSelectProductStatus={onSelectProductStatus}
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
				className="BranchBalanceItem_table"
				columns={columns}
				dataSource={data}
				scroll={{ x: 1000 }}
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
				bordered
			/>
		</div>
	);
};

interface FilterProps {
	productCategories: IProductCategory[];
	onSearch: any;
	onSelectProductStatus: any;
	onSelectProductCategory: any;
}

const Filter = ({
	productCategories,
	onSearch,
	onSelectProductStatus,
	onSelectProductCategory,
}: FilterProps) => (
	<Row gutter={[15, 15]}>
		<Col lg={12} span={24}>
			<Label label="Search" spacing />
			<Input
				prefix={<SearchOutlined />}
				onChange={(event) => onSearch(event.target.value.trim())}
				allowClear
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
					onSelectProductStatus(value);
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
