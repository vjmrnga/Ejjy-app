import { CheckOutlined } from '@ant-design/icons';
import { Button, Col, Radio, Row, Space, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader } from 'components';
import { Label } from 'components/elements';
import { attendanceCategories, EMPTY_CELL, MAX_PAGE_SIZE } from 'global';
import {
	useProblematicAttendanceLogApproveDecline,
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
			{
				title: 'Suggested',
				dataIndex: 'suggestedDateTime',
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
	const { params } = useQueryParams();
	const {
		data: { problematicAttendanceLogs },
		isFetching: isFetchingProblematicAttendanceLogs,
		error: problematicAttendanceLogsError,
	} = useProblematicAttendanceLogs({
		params: {
			...params,
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
			.filter(
				(log) =>
					(log.attendance_category === attendanceCategories.ATTENDANCE &&
						log.suggested_resolved_clock_out_time) ||
					log.attendance_category === attendanceCategories.TRACKER,
			)
			.map((log) => ({
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
					log.attendance_type,
				),
				actions: (
					<Space>
						{}
						<Tooltip title="Approve">
							<Button
								icon={<CheckOutlined />}
								type="primary"
								ghost
								onClick={() =>
									approveDeclineProblematicAttendanceLog({
										id: log.id,
										isApproved: true,
									})
								}
							/>
						</Tooltip>
						{log.attendance_category === attendanceCategories.ATTENDANCE && (
							<Tooltip title="Decline">
								<Button
									icon={<CheckOutlined />}
									type="primary"
									ghost
									onClick={() =>
										approveDeclineProblematicAttendanceLog({
											id: log.id,
											isApproved: false,
										})
									}
								/>
							</Tooltip>
						)}
					</Space>
				),
			}));

		setDataSource(data);
	}, [problematicAttendanceLogs]);

	return (
		<>
			<TableHeader title="Daily Time Record" wrapperClassName="px-0 pt-0" />

			<Filter />

			<RequestErrors
				errors={[
					...convertIntoArray(problematicAttendanceLogsError, 'List'),
					...convertIntoArray(
						approveDeclineProblematicAttendanceLogError?.errors,
						'Create',
					),
				]}
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={
					isFetchingProblematicAttendanceLogs ||
					isApprovingOrDecliningProblematicAttendanceLog
				}
				pagination={false}
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
