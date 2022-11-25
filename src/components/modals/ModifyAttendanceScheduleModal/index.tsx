import { message, Modal } from 'antd';
import { RequestErrors } from 'components';
import {
	attendanceSchedulePeriods,
	attendanceScheduleTypes,
	GENERIC_ERROR_MESSAGE,
	MAX_PAGE_SIZE,
} from 'global';
import { useAttendanceScheduleBulkEdit, useAttendanceSchedules } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray } from 'utils';
import { ModifyAttendanceScheduleForm } from './ModifyAttendanceScheduleForm';

interface Props {
	account: any;
	onClose: any;
}

export const ModifyAttendanceScheduleModal = ({ account, onClose }: Props) => {
	// STATES
	const [schedules, setSchedules] = useState(null);
	const [errors, setErrors] = useState([]);

	// CUSTOM HOOKS
	const {
		data: { attendanceSchedules },
		isFetching: isFetchingAttendanceSchedules,
		error: attendanceSchedulesError,
	} = useAttendanceSchedules({
		params: {
			employeeId: account.id,
			pageSize: MAX_PAGE_SIZE,
		},
	});
	const {
		mutateAsync: bulkEditAttendanceSchedules,
		isLoading: isEditLoading,
		error: editError,
	} = useAttendanceScheduleBulkEdit();

	// METHODS
	useEffect(() => {
		if (attendanceSchedules.length) {
			setErrors([]);

			const findAttendanceSchedule = (type, period) =>
				attendanceSchedules.find(
					(as) => as.attendance_type === type && as.period === period,
				);

			const clockInMorning = findAttendanceSchedule(
				attendanceScheduleTypes.CLOCK_IN,
				attendanceSchedulePeriods.MORNING,
			);
			const clockOutMorning = findAttendanceSchedule(
				attendanceScheduleTypes.CLOCK_OUT,
				attendanceSchedulePeriods.MORNING,
			);
			const clockInAfternoon = findAttendanceSchedule(
				attendanceScheduleTypes.CLOCK_IN,
				attendanceSchedulePeriods.AFTERNOON,
			);
			const clockOutAfternoon = findAttendanceSchedule(
				attendanceScheduleTypes.CLOCK_OUT,
				attendanceSchedulePeriods.AFTERNOON,
			);

			if (
				clockInMorning &&
				clockOutMorning &&
				clockInAfternoon &&
				clockOutAfternoon
			) {
				setSchedules({
					clockInMorning,
					clockOutMorning,
					clockInAfternoon,
					clockOutAfternoon,
				});
			} else {
				setErrors([GENERIC_ERROR_MESSAGE]);
			}
		}
	}, [attendanceSchedules]);

	const handleSubmit = async (formData) => {
		await bulkEditAttendanceSchedules({
			schedules: [
				{
					id: formData.clockInMorningId,
					attendance_time: formData.clockInMorningTime,
				},
				{
					id: formData.clockOutMorningId,
					attendance_time: formData.clockOutMorningTime,
				},
				{
					id: formData.clockInAfternoonId,
					attendance_time: formData.clockInAfternoonTime,
				},
				{
					id: formData.clockOutAfternoonId,
					attendance_time: formData.clockOutAfternoonTime,
				},
			],
		});

		message.success(
			`${account.first_name}'s schedules were edited sucessfully.`,
		);

		onClose();
	};

	return (
		<Modal
			footer={null}
			title="Set Attendance Schedule"
			width={600}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(attendanceSchedulesError),
					...convertIntoArray(editError?.errors),
					...errors,
				]}
				withSpaceBottom
			/>

			{schedules && (
				<ModifyAttendanceScheduleForm
					loading={isFetchingAttendanceSchedules || isEditLoading}
					schedules={schedules}
					onClose={onClose}
					onSubmit={handleSubmit}
				/>
			)}
		</Modal>
	);
};
