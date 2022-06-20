import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Table } from 'antd';
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
} from 'global';
import { useBranchProducts, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { convertIntoArray, formatQuantity } from 'utils';

const columns: ColumnsType = [
	{ title: 'Code', dataIndex: 'code' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Balance', dataIndex: 'balance' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabBranchProducts = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBranchProduct, setSelectedBranchProduct] = useState(null);

	// CUSTOM HOOKS
	const queryClient = useQueryClient();
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branchProducts, total },
		isFetching,
		error,
	} = useBranchProducts({
		params: {
			hasNegativeBalance: true,
			...params,
		},
	});

	// METHODS
	useEffect(() => {
		const data = branchProducts.map((branchProduct) => ({
			key: branchProduct.id,
			code:
				branchProduct.product.barcode ||
				branchProduct.product.selling_barcode ||
				branchProduct.product.textcode,
			name: branchProduct.product.name,
			balance: formatQuantity(
				branchProduct.product.unit_of_measurement,
				branchProduct.current_balance,
			),
			actions: (
				<Button
					type="primary"
					onClick={() => setSelectedBranchProduct(branchProduct)}
				>
					Create Balance Adjustment
				</Button>
			),
		}));

		setDataSource(data);
	}, [branchProducts]);

	return (
		<>
			<TableHeader title="Branch Products" />

			<Filter />

			<RequestErrors errors={convertIntoArray(error)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 800 }}
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
				loading={isFetching}
			/>

			{selectedBranchProduct && (
				<CreateBalanceAdjustmentLogModal
					branchProduct={selectedBranchProduct}
					onClose={() => setSelectedBranchProduct(null)}
					onSuccess={() => {
						queryClient.invalidateQueries('useBranchProducts');
					}}
				/>
			)}
		</>
	);
};

const Filter = () => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();

	// METHODS
	const onSearchDebounced = useCallback(
		_.debounce((search) => {
			setQueryParams({ search }, { shouldResetPage: true });
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					prefix={<SearchOutlined />}
					defaultValue={params.search}
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
					allowClear
				/>
			</Col>
		</Row>
	);
};
