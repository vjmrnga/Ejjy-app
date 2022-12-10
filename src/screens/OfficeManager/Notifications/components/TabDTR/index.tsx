import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, message, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader } from 'components';
import {
	attendanceCategories,
	attendanceTypes,
	EMPTY_CELL,
	MAX_PAGE_SIZE,
} from 'global';
import {
	useProblematicAttendanceLogApproveDecline,
	useProblematicAttendanceLogs,
} from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDateTime,
	getAttendanceLogDescription,
	getFullName,
} from 'utils';

const attendanceTableColumns: ColumnsType = [
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
			{
				title: 'Suggested',
				dataIndex: 'suggestedDateTime',
			},
		],
	},
	{ title: 'Description', dataIndex: 'description' },
	{ title: 'Actions', dataIndex: 'actions' },
];

const trackerTableColumns: ColumnsType = [
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
	{ title: 'Description', dataIndex: 'description' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabDTR = () => {
	// STATES
	const [attendanceSource, setAttendanceSource] = useState([]);
	const [trackerDataSource, setTrackerDataSource] = useState([]);

	// CUSTOM HOOKS

	const {
		data: { problematicAttendanceLogs },
		isFetching: isFetchingProblematicAttendanceLogs,
		error: problematicAttendanceLogsError,
	} = useProblematicAttendanceLogs({
		params: {
			attendanceCategory: attendanceCategories.ATTENDANCE,
			pageSize: MAX_PAGE_SIZE,
		},
	});
	const {
		data: { problematicAttendanceLogs: problematicTrackerLogs },
		isFetching: isFetchingProblematicTrackerLogs,
		error: problematicTrackerLogsError,
	} = useProblematicAttendanceLogs({
		params: {
			attendanceCategory: attendanceCategories.TRACKER,
			pageSize: MAX_PAGE_SIZE,
		},
	});
	const {
		mutateAsync: approveDeclineProblematicAttendanceLog,
		isLoading: isApprovingOrDecliningProblematicAttendanceLog,
		error: approveDeclineProblematicAttendanceLogError,
	} = useProblematicAttendanceLogApproveDecline();

	// METHODS
	useEffect(() => {
		const data = problematicAttendanceLogs
			.filter((log) => log.suggested_resolved_clock_out_time)
			.map(getRowDetails);

		setAttendanceSource(data);
	}, [problematicAttendanceLogs]);

	useEffect(() => {
		const data = problematicTrackerLogs
			.filter((log) => !log.is_resolved_by_head_office)
			.map(getRowDetails);

		setTrackerDataSource(data);
	}, [problematicTrackerLogs]);

	const getRowDetails = (log) => ({
		key: log.id,
		name: getFullName(log.employee),
		scheduledDateTime: log.scheduled_time
			? formatDateTime(log.scheduled_time)
			: EMPTY_CELL,
		suggestedDateTime: log.suggested_resolved_clock_out_time ? (
			<Tag color="orange">
				{formatDateTime(log.suggested_resolved_clock_out_time)}
			</Tag>
		) : (
			EMPTY_CELL
		),
		realDateTime: log.real_time ? formatDateTime(log.real_time) : EMPTY_CELL,
		type: _.upperFirst(log.attendance_category),
		description: getAttendanceLogDescription(
			log.attendance_category,
			log.attendance_category === attendanceCategories.ATTENDANCE
				? attendanceTypes.IN
				: log.attendance_type,
		),
		actions: (
			<Space>
				<Tooltip title="Approve">
					<Button
						icon={<CheckOutlined />}
						type="primary"
						ghost
						onClick={async () => {
							await approveDeclineProblematicAttendanceLog({
								id: log.id,
								isApproved: true,
							});

							message.success(
								`${log.employee.first_name}'s attendance log was approved successfully`,
							);
						}}
					/>
				</Tooltip>
				{log.attendance_category === attendanceCategories.ATTENDANCE && (
					<Tooltip title="Decline">
						<Button
							icon={<CloseOutlined />}
							type="primary"
							danger
							ghost
							onClick={async () => {
								await approveDeclineProblematicAttendanceLog({
									id: log.id,
									isApproved: false,
								});

								message.success(
									`${log.employee.first_name}'s attendance log was declined successfully`,
								);
							}}
						/>
					</Tooltip>
				)}
			</Space>
		),
	});

	return (
		<>
			<TableHeader title="Daily Time Record" wrapperClassName="pt-2 px-0" />

			<RequestErrors
				errors={[
					...convertIntoArray(
						problematicAttendanceLogsError,
						'Attendance Logs',
					),
					...convertIntoArray(problematicTrackerLogsError, 'Tracker Logs'),
					...convertIntoArray(
						approveDeclineProblematicAttendanceLogError?.errors,
						'Approve or Decline',
					),
				]}
				withSpaceBottom
			/>

			<Table
				columns={attendanceTableColumns}
				dataSource={attendanceSource}
				loading={
					isFetchingProblematicAttendanceLogs ||
					isApprovingOrDecliningProblematicAttendanceLog
				}
				pagination={false}
				scroll={{ x: 800 }}
				title={() => (
					<Typography.Title className="ma-0" level={5}>
						Attendance
					</Typography.Title>
				)}
				bordered
			/>
			<Table
				className="mt-6"
				columns={trackerTableColumns}
				dataSource={trackerDataSource}
				loading={
					isFetchingProblematicTrackerLogs ||
					isApprovingOrDecliningProblematicAttendanceLog
				}
				pagination={false}
				scroll={{ x: 800 }}
				title={() => (
					<Typography.Title className="ma-0" level={5}>
						Tracker
					</Typography.Title>
				)}
				bordered
			/>
		</>
	);
};
