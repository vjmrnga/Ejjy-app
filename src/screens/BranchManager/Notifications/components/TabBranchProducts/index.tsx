import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Space, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	CreateBalanceAdjustmentLogModal,
	RequestErrors,
	TableHeader,
} from 'components';
import { Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	pageSizeOptions,
	SEARCH_DEBOUNCE_TIME,
	SHOW_HIDE_SHORTCUT,
} from 'global';
import { useBranchProducts, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	confirmPassword,
	convertIntoArray,
	formatQuantity,
	getKeyDownCombination,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'Code', dataIndex: 'code' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Balance', dataIndex: 'balance' },
	{
		title: (
			<Space>
				<span>Actions</span>
				<Tag color="warning">Requires admin permission</Tag>
			</Space>
		),
		dataIndex: 'actions',
	},
];

export const TabBranchProducts = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBranchProduct, setSelectedBranchProduct] = useState(null);
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branchProducts, total },
		isFetching: isFetchingBranchProducts,
		error: branchProductsError,
	} = useBranchProducts({
		params: {
			hasNegativeBalance: true,
			...params,
		},
	});

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	useEffect(() => {
		const data = branchProducts.map((branchProduct) => ({
			key: branchProduct.id,
			code:
				branchProduct.product.barcode ||
				branchProduct.product.selling_barcode ||
				branchProduct.product.textcode,
			name: branchProduct.product.name,
			balance: formatQuantity({
				unitOfMeasurement: branchProduct.product.unit_of_measurement,
				quantity: branchProduct.current_balance,
			}),
			actions: (
				<Tooltip title="Create Balance Adjustment">
					<Button
						disabled={!isCurrentBalanceVisible}
						icon={<PlusOutlined />}
						type="primary"
						ghost
						onClick={
							isCurrentBalanceVisible
								? () => setSelectedBranchProduct(branchProduct)
								: undefined
						}
					/>
				</Tooltip>
			),
		}));

		setDataSource(data);
	}, [isCurrentBalanceVisible, branchProducts]);

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (SHOW_HIDE_SHORTCUT.includes(key)) {
			event.preventDefault();
			if (isCurrentBalanceVisible) {
				setIsCurrentBalanceVisible(false);
			} else {
				confirmPassword({
					onSuccess: () => setIsCurrentBalanceVisible(true),
				});
			}
		}
	};

	return (
		<>
			<TableHeader title="Branch Products" wrapperClassName="pt-2 px-0" />

			<RequestErrors
				errors={convertIntoArray(branchProductsError)}
				withSpaceBottom
			/>

			<Filter />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingBranchProducts}
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
				scroll={{ x: 800 }}
				bordered
			/>

			{selectedBranchProduct && (
				<CreateBalanceAdjustmentLogModal
					branchProduct={selectedBranchProduct}
					onClose={() => setSelectedBranchProduct(null)}
				/>
			)}
		</>
	);
};

const Filter = () => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();

	// METHODS
	const handleSearchDebounced = useCallback(
		_.debounce((search) => {
			setQueryParams({ search }, { shouldResetPage: true });
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12}>
				<Label label="Search" spacing />
				<Input
					defaultValue={params.search}
					prefix={<SearchOutlined />}
					allowClear
					onChange={(event) => handleSearchDebounced(event.target.value.trim())}
				/>
			</Col>
		</Row>
	);
};
