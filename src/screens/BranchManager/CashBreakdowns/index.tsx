import { Col, Row, Select } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	Content,
	RequestErrors,
	TableActions,
	TableHeader,
	TimeRangeFilter,
	ViewCashBreakdownModal,
} from 'components';
import { Box, Label } from 'components/elements';
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
		label: 'Beginning Session',
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

export const CashBreakdowns = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedCashBreakdown, setSelectedCashBreakdown] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { cashBreakdowns, total },
		isFetching,
		error: listError,
	} = useCashBreakdowns({
		params: {
			...params,
			timeRange: params.timeRange || timeRangeTypes.DAILY,
		},
	});

	// METHODS
	useEffect(() => {
		const formattedCashBreakdowns = cashBreakdowns.map((cashBreakdown) => ({
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

		setDataSource(formattedCashBreakdowns);
	}, [cashBreakdowns]);

	return (
		<Content title="Cash Breakdowns">
			<Box>
				<TableHeader title="Cash Breakdowns" />

				<RequestErrors
					className="px-6"
					errors={convertIntoArray(listError)}
					withSpaceBottom
				/>

				<Filter isLoading={isFetching} />

				<Table
					columns={columns}
					dataSource={dataSource}
					scroll={{ x: 800 }}
					loading={isFetching}
					bordered
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
				/>

				{selectedCashBreakdown && (
					<ViewCashBreakdownModal
						cashBreakdown={selectedCashBreakdown}
						onClose={() => {
							setSelectedCashBreakdown(null);
						}}
					/>
				)}
			</Box>
		</Content>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branchMachines },
		isFetching: isFetchingBranchMachines,
	} = useBranchMachines();
	const {
		data: { users },
		isFetching: isFetchingUsers,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	return (
		<Row className="mb-4 px-6" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<TimeRangeFilter disabled={isLoading} />
			</Col>

			<Col lg={12} span={24}>
				<Label label="Type" spacing />
				<Select
					className="w-100"
					value={params.cbType}
					onChange={(value) => {
						let selectedType = _.toString(value);
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
					disabled={isLoading}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					showSearch
					allowClear
				>
					{cashBreakdownOptions.map((option) => (
						<Select.Option key={option.value} value={option.value}>
							{option.label}
						</Select.Option>
					))}
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Branch Machine" spacing />
				<Select
					className="w-100"
					defaultValue={params.branchMachineId}
					onChange={(value) => {
						setQueryParams(
							{ branchMachineId: value },
							{ shouldResetPage: true },
						);
					}}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					disabled={isFetchingBranchMachines || isLoading}
					allowClear
					showSearch
				>
					{branchMachines.map(({ id, name }) => (
						<Select.Option key={id} value={id}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<Label label="User" spacing />
				<Select
					className="w-100"
					defaultValue={params.creatingUserId}
					onChange={(value) => {
						setQueryParams(
							{ creatingUserId: value },
							{ shouldResetPage: true },
						);
					}}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					disabled={isFetchingUsers || isLoading}
					allowClear
					showSearch
				>
					{users.map((user) => (
						<Select.Option key={user.id} value={user.id}>
							{getFullName(user)}
						</Select.Option>
					))}
				</Select>
			</Col>
		</Row>
	);
};
