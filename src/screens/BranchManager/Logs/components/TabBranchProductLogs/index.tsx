import { Col, Row, Select, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import { Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	SEARCH_DEBOUNCE_TIME,
	userLogTypes,
} from 'global';
import {
	useBranchProducts,
	useQueryParams,
	useUserLogs,
	useUsers,
} from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	formatDateTimeExtended,
	getFullName,
	getLocalBranchId,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Description', dataIndex: 'description' },
	{ title: 'Date & Time', dataIndex: 'datetimeCreated' },
];

export const TabBranchProductLogs = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();

	const {
		data: { logs, total },
		isFetching: isFetchingLogs,
		error: logsError,
	} = useUserLogs({
		params: { ...params, type: userLogTypes.BRANCH_PRODUCTS },
	});

	// METHODS
	useEffect(() => {
		const data = logs.map((log) => ({
			key: log.id,
			user: getFullName(log.acting_user),
			description: log.description,
			datetimeCreated: formatDateTimeExtended(log.datetime_created),
		}));

		setDataSource(data);
	}, [logs]);

	return (
		<div>
			<TableHeader title="Branch Product Logs" wrapperClassName="pt-2 px-0" />

			<Filter />

			<RequestErrors
				errors={convertIntoArray(logsError, 'Logs')}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingLogs}
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
				scroll={{ x: 1000 }}
			/>
		</div>
	);
};

const Filter = () => {
	// STATES
	const [productSearch, setProductSearch] = useState('');

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: usersError,
	} = useUsers({
		params: {
			branchId: getLocalBranchId(),
			pageSize: MAX_PAGE_SIZE,
		},
	});
	const {
		data: { branchProducts },
		isFetching: isFetchingBranchProducts,
		error: branchProductsError,
	} = useBranchProducts({
		params: {
			ids: productSearch ? undefined : _.toString(params?.branchProductId),
			search: productSearch,
		},
	});

	// METHODS
	const handleDebouncedSearch = useCallback(
		_.debounce((search) => {
			setProductSearch(search);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<>
			<RequestErrors
				errors={[
					...convertIntoArray(branchProductsError, 'Branch Product'),
					...convertIntoArray(usersError, 'Users'),
				]}
				withSpaceBottom
			/>

			<Row className="mb-4" gutter={[16, 16]}>
				<Col md={12}>
					<Label label="Product" spacing />
					<Select
						className="w-100"
						defaultActiveFirstOption={false}
						defaultValue={
							params.branchProductId ? Number(params.branchProductId) : null
						}
						filterOption={false}
						notFoundContent={isFetchingBranchProducts ? <Spin /> : null}
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams(
								{ branchProductId: value },
								{ shouldResetPage: true },
							);
						}}
						onSearch={handleDebouncedSearch}
					>
						{branchProducts.map((branchProduct) => (
							<Select.Option key={branchProduct.id} value={branchProduct.id}>
								{branchProduct.product.name}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col md={12}>
					<Label label="User" spacing />
					<Select
						className="w-100"
						defaultValue={
							params.actingUserId ? Number(params.actingUserId) : null
						}
						filterOption={filterOption}
						loading={isFetchingUsers}
						optionFilterProp="children"
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams(
								{ actingUserId: value },
								{ shouldResetPage: true },
							);
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
