import { CheckOutlined } from '@ant-design/icons';
import { Button, Col, Radio, Row, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader } from 'components';
import { Label } from 'components/elements';
import {
	attendanceCategories,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	pageSizeOptions,
} from 'global';
import { useAuth, useProblematicAttendanceLogs, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDateTime,
	formatQuantity,
	getAttendanceLogDescription,
	getFullName,
	getLocalBranchId,
	isUserFromBranch,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'Employee Name', dataIndex: 'name' },
	{
		title: 'Date & Time',
		children: [
			{
				title: 'Scheduled',
				dataIndex: 'scheduledDateTime',
			},
			{
				title: 'Real',
				dataIndex: 'realDateTime',
			},
		],
	},
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Description', dataIndex: 'description' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabDTR = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const { user } = useAuth();
	const {
		data: { problematicAttendanceLogs, total },
		isFetching: isFetchingProblematicAttendanceLogs,
		error: problematicAttendanceLogsError,
	} = useProblematicAttendanceLogs({
		params: {
			...params,
			branchId: isUserFromBranch(user.user_type)
				? getLocalBranchId()
				: params?.branchId,
		},
	});

	// METHODS
	useEffect(() => {
		const data = problematicAttendanceLogs.map((log) => ({
			key: log.id,
			name: getFullName(log.employee),
			scheduledDateTime: formatDateTime(log.scheduled_time),
			realDateTime: formatDateTime(log.real_time),
			type: _.upperFirst(log.attendance_category),
			description: getAttendanceLogDescription(
				log.attendance_category,
				log.attendance_type,
			),
		}));

		setDataSource(data);
	}, [problematicAttendanceLogs]);

	useEffect(() => {
		const data = problematicAttendanceLogs.map((branchProduct) => ({
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
					<Button icon={<CheckOutlined />} type="primary" ghost />
				</Tooltip>
			),
		}));

		setDataSource(data);
	}, [problematicAttendanceLogs]);

	return (
		<>
			<TableHeader title="Daily Time Record" wrapperClassName="px-0 pt-0" />

			<Filter />

			<RequestErrors
				errors={convertIntoArray(problematicAttendanceLogsError)}
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingProblematicAttendanceLogs}
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
		</>
	);
};

const Filter = () => {
	const { params, setQueryParams } = useQueryParams();

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col md={12}>
				<Label label="Type" spacing />
				<Radio.Group
					defaultValue={null}
					options={[
						{ label: 'All', value: null },
						{ label: 'Attendance', value: attendanceCategories.ATTENDANCE },
						{
							label: 'Tracker',
							value: attendanceCategories.TRACKER,
						},
					]}
					optionType="button"
					value={params.attendanceCategory}
					onChange={(e) => {
						setQueryParams(
							{ attendanceCategory: e.target.value },
							{ shouldResetPage: true },
						);
					}}
				/>
			</Col>
		</Row>
	);
};
