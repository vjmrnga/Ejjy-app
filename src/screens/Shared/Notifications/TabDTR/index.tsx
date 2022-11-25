import { CheckOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import { Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
} from 'global';
import {
	useBranches,
	useBranchProducts,
	useQueryParams,
	useUsers,
} from 'hooks';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	formatQuantity,
	getFullName,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Date', dataIndex: 'date' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabDTR = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branchProducts, total },
		isFetching,
		error,
	} = useBranchProducts({});

	// METHODS
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
				<Tooltip title="Resolve">
					<Button icon={<CheckOutlined />} type="primary" />
				</Tooltip>
			),
		}));

		setDataSource(data);
	}, [branchProducts]);

	return (
		<>
			<TableHeader title="Daily Time Record" wrapperClassName="pt-2 px-0" />

			<Filter />

			<RequestErrors errors={convertIntoArray(error)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetching}
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
			/>
		</>
	);
};

const Filter = () => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branches },
		isFetching: isFetchingBranches,
		error: branchErrors,
	} = useBranches({
		params: { pageSize: MAX_PAGE_SIZE },
	});
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: userErrors,
	} = useUsers({
		params: {
			branchId: params.branchId,
			pageSize: MAX_PAGE_SIZE,
		},
	});

	return (
		<>
			<RequestErrors
				errors={[
					...convertIntoArray(userErrors, 'Users'),
					...convertIntoArray(branchErrors, 'Branches'),
				]}
				withSpaceBottom
			/>

			<Row className="mb-4" gutter={[16, 16]}>
				<Col sm={12} xs={24}>
					<Label label="Branch" spacing />
					<Select
						className="w-100"
						filterOption={filterOption}
						loading={isFetchingBranches}
						optionFilterProp="children"
						value={params.branchId ? Number(params.branchId) : null}
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams({ branchId: value }, { shouldResetPage: true });
						}}
					>
						{branches.map((branch) => (
							<Select.Option key={branch.id} value={branch.id}>
								{branch.name}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col sm={12} xs={24}>
					<Label label="User" spacing />
					<Select
						className="w-100"
						filterOption={filterOption}
						loading={isFetchingUsers}
						optionFilterProp="children"
						value={params.userId ? Number(params.userId) : null}
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams({ userId: value }, { shouldResetPage: true });
						}}
					>
						{users.map((user) => (
							<Select.Option key={user.id} value={user.id}>
								{getFullName(user)}
							</Select.Option>
						))}
					</Select>
				</Col>
				<Col lg={12} span={24}>
					<TimeRangeFilter />
				</Col>
			</Row>
		</>
	);
};
