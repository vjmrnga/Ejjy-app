import { Col, Row, Select } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	RequestErrors,
	TableActions,
	TableHeader,
	TimeRangeFilter,
	ViewCashBreakdownModal,
} from 'components';
import { Label } from 'components/elements';
import {
	cashBreakdownCategories,
	cashBreakdownTypes,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	timeRangeTypes,
} from 'global';
import {
	useBranchMachines,
	useCashBreakdowns,
	useQueryParams,
	useUsers,
} from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	formatDateTime,
	getCashBreakdownTypeDescription,
	getFullName,
} from 'utils';

export const cashBreakdownOptions = [
	{
		label: 'Cash In',
		value: cashBreakdownCategories.CASH_IN,
	},
	{
		label: 'Cash Out',
		value: cashBreakdownCategories.CASH_OUT,
	},
	{
		label: 'Cash Collection',
		value: cashBreakdownTypes.MID_SESSION,
	},
	{
		label: 'Start Session',
		value: cashBreakdownTypes.START_SESSION,
	},
	{
		label: 'End Session',
		value: cashBreakdownTypes.END_SESSION,
	},
];

const columns: ColumnsType = [
	{ title: 'Date & Time', dataIndex: 'datetime' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Machine Name', dataIndex: 'machineName' },
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabCashBreakdowns = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedCashBreakdown, setSelectedCashBreakdown] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { cashBreakdowns, total },
		isFetching: isFetchingCashBreakdowns,
		error: cashBreakdownsError,
	} = useCashBreakdowns({
		params: {
			...params,
			timeRange: params.timeRange || timeRangeTypes.DAILY,
		},
	});

	// METHODS
	useEffect(() => {
		const data = cashBreakdowns.map((cashBreakdown) => ({
			key: cashBreakdown.id,
			datetime: formatDateTime(cashBreakdown.datetime_created),
			type: getCashBreakdownTypeDescription(
				cashBreakdown.category,
				cashBreakdown.type,
			),
			machineName: cashBreakdown.branch_machine?.name,
			user: getFullName(cashBreakdown.cashiering_session.user),
			actions: (
				<TableActions
					onView={() => {
						setSelectedCashBreakdown(cashBreakdown);
					}}
				/>
			),
		}));

		setDataSource(data);
	}, [cashBreakdowns]);

	return (
		<>
			<TableHeader title="Cash Breakdowns" wrapperClassName="pt-2 px-0" />

			<Filter />

			<RequestErrors
				errors={convertIntoArray(cashBreakdownsError)}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingCashBreakdowns}
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

			{selectedCashBreakdown && (
				<ViewCashBreakdownModal
					cashBreakdown={selectedCashBreakdown}
					onClose={() => {
						setSelectedCashBreakdown(null);
					}}
				/>
			)}
		</>
	);
};

const Filter = () => {
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branchMachines },
		isFetching: isFetchingBranchMachines,
		error: branchMachinesError,
	} = useBranchMachines();
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: usersError,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	return (
		<>
			<RequestErrors
				errors={[
					...convertIntoArray(branchMachinesError, 'Branch Machines'),
					...convertIntoArray(usersError, 'Users'),
				]}
				withSpaceBottom
			/>

			<Row className="mb-4" gutter={[16, 16]}>
				<Col md={12}>
					<TimeRangeFilter />
				</Col>

				<Col md={12}>
					<Label label="Type" spacing />
					<Select
						className="w-100"
						filterOption={filterOption}
						optionFilterProp="children"
						value={params.cbType}
						allowClear
						showSearch
						onChange={(value) => {
							const selectedType = _.toString(value);
							let type = '';
							let category = '';
							if (
								[
									cashBreakdownCategories.CASH_IN,
									cashBreakdownCategories.CASH_OUT,
									cashBreakdownTypes.MID_SESSION,
								].includes(selectedType)
							) {
								type = cashBreakdownTypes.MID_SESSION;
								category =
									selectedType === cashBreakdownTypes.MID_SESSION
										? cashBreakdownCategories.CASH_BREAKDOWN
										: selectedType;
							}

							if (
								[
									cashBreakdownTypes.START_SESSION,
									cashBreakdownTypes.END_SESSION,
								].includes(selectedType)
							) {
								type = selectedType;
								category = cashBreakdownCategories.CASH_BREAKDOWN;
							}

							setQueryParams(
								{ cbType: selectedType, type, category },
								{ shouldResetPage: true },
							);
						}}
					>
						{cashBreakdownOptions.map((option) => (
							<Select.Option key={option.value} value={option.value}>
								{option.label}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col md={12}>
					<Label label="Branch Machine" spacing />
					<Select
						className="w-100"
						defaultValue={params.branchMachineId}
						disabled={isFetchingBranchMachines}
						filterOption={filterOption}
						optionFilterProp="children"
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams(
								{ branchMachineId: value },
								{ shouldResetPage: true },
							);
						}}
					>
						{branchMachines.map(({ id, name }) => (
							<Select.Option key={id} value={id}>
								{name}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col md={12}>
					<Label label="User" spacing />
					<Select
						className="w-100"
						defaultValue={params.creatingUserId}
						disabled={isFetchingUsers}
						filterOption={filterOption}
						optionFilterProp="children"
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams(
								{ creatingUserId: value },
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
			</Row>
		</>
	);
};
