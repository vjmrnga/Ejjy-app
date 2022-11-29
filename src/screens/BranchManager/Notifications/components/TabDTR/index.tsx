import { CheckOutlined } from '@ant-design/icons';
import { Button, Col, Radio, Row, Table, Tag, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	RequestErrors,
	ResolveProblematicAttendanceLogModal,
	TableHeader,
} from 'components';
import { Label } from 'components/elements';
import {
	attendanceCategories,
	attendanceTypes,
	EMPTY_CELL,
	MAX_PAGE_SIZE,
	serviceTypes,
} from 'global';
import {
	useAttendanceLogs,
	useAuth,
	useProblematicAttendanceLogs,
	useQueryParams,
} from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDateTime,
	getAttendanceLogDescription,
	getFullName,
	isUserFromBranch,
} from 'utils';

const ongoingTableColumns: ColumnsType = [
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

const pendingTableColumns: ColumnsType = [
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
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Description', dataIndex: 'description' },
];

export const TabDTR = () => {
	// STATES
	const [selectedAttendanceLog, setSelectedAttendanceLog] = useState(null);
	const [ongoingDataSource, setOngoingDataSource] = useState([]);
	const [pendingDataSource, setPendingDataSource] = useState([]);

	// VARIABLES
	const params = {
		attendanceCategory: attendanceCategories.ATTENDANCE,
		pageSize: MAX_PAGE_SIZE,
	};

	// CUSTOM HOOKS
	const { user } = useAuth();
	const { isSuccess: isAttendanceLogsSuccess } = useAttendanceLogs({
		params: {
			...params,
			serviceType: serviceTypes.OFFLINE,
		},
		options: { notifyOnChangeProps: ['isSuccess'] },
	});
	const {
		data: { problematicAttendanceLogs },
		isFetching: isFetchingProblematicAttendanceLogs,
		error: problematicAttendanceLogsError,
	} = useProblematicAttendanceLogs({
		params,
		options: { enabled: isAttendanceLogsSuccess },
	});

	// METHODS
	useEffect(() => {
		const ongoingLogs = [];
		const pendingLogs = [];

		problematicAttendanceLogs.forEach((log) => {
			const data = {
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
				realDateTime: log.real_time
					? formatDateTime(log.real_time)
					: EMPTY_CELL,
				type: _.upperFirst(log.attendance_category),
				description: getAttendanceLogDescription(
					log.attendance_category,
					attendanceTypes.OUT,
				),
				actions: (
					<Tooltip title="Resolve">
						<Button
							icon={<CheckOutlined />}
							type="primary"
							ghost
							onClick={() => setSelectedAttendanceLog(log)}
						/>
					</Tooltip>
				),
			};

			if (log.suggested_resolved_clock_out_time === null) {
				ongoingLogs.push(data);
			} else {
				pendingLogs.push(data);
			}
		});

		setOngoingDataSource(ongoingLogs);
		setPendingDataSource(pendingLogs);
	}, [problematicAttendanceLogs]);

	return (
		<>
			<TableHeader title="Daily Time Record" wrapperClassName="px-0 pt-0" />
			{!isUserFromBranch(user.user_type) && <Filter />}
			<RequestErrors
				errors={convertIntoArray(problematicAttendanceLogsError)}
			/>

			<Table
				columns={ongoingTableColumns}
				dataSource={ongoingDataSource}
				loading={isFetchingProblematicAttendanceLogs}
				pagination={false}
				scroll={{ x: 800 }}
				title={() => (
					<Typography.Title className="ma-0" level={5}>
						Ongoing
					</Typography.Title>
				)}
				bordered
			/>

			<Table
				className="mt-6"
				columns={pendingTableColumns}
				dataSource={pendingDataSource}
				loading={isFetchingProblematicAttendanceLogs}
				pagination={false}
				scroll={{ x: 800 }}
				title={() => (
					<Typography.Title className="ma-0" level={5}>
						Pending Approval
					</Typography.Title>
				)}
				bordered
			/>

			{selectedAttendanceLog && (
				<ResolveProblematicAttendanceLogModal
					problematicAttendanceLog={selectedAttendanceLog}
					onClose={() => setSelectedAttendanceLog(null)}
				/>
			)}
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
