import { Button, Col, Divider, Row, TimePicker } from 'antd';
import { ErrorMessage, Form, Formik, useFormikContext } from 'formik';
import moment from 'moment';
import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { FieldError, Label } from '../../elements';

interface Props {
	schedules?: any;
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyAttendanceScheduleForm = ({
	schedules,
	loading,
	onSubmit,
	onClose,
}: Props) => {
	// METHODS
	const getFormDetails = useCallback(
		() => ({
			defaultValues: {
				clockInMorningTime: schedules?.clockInMorning.attendance_time
					? moment(schedules.clockInMorning.attendance_time, 'hh:mm:ss')
					: null,
				clockInMorningId: schedules.clockInMorning.id,
				clockOutMorningTime: schedules?.clockOutMorning.attendance_time
					? moment(schedules.clockOutMorning.attendance_time, 'hh:mm:ss')
					: null,
				clockOutMorningId: schedules.clockOutMorning.id,
				clockInAfternoonTime: schedules?.clockInAfternoon.attendance_time
					? moment(schedules.clockInAfternoon.attendance_time, 'hh:mm:ss')
					: null,
				clockInAfternoonId: schedules.clockInAfternoon.id,
				clockOutAfternoonTime: schedules?.clockOutAfternoon.attendance_time
					? moment(schedules.clockOutAfternoon.attendance_time, 'hh:mm:ss')
					: null,
				clockOutAfternoonId: schedules.clockOutAfternoon.id,
			},
			schema: Yup.object().shape({
				clockInMorningTime: Yup.string()
					.nullable()
					.required()
					.label('Clock In Morning'),
				clockOutMorningTime: Yup.string()
					.nullable()
					.required()
					.label('Clock Out Morning'),
				clockInAfternoonTime: Yup.string()
					.nullable()
					.required()
					.label('Clock In Afternoon'),
				clockOutAfternoonTime: Yup.string()
					.nullable()
					.required()
					.label('Clock Out Afternoon'),
			}),
		}),
		[schedules],
	);

	return (
		<Formik
			initialValues={getFormDetails().defaultValues}
			validationSchema={getFormDetails().schema}
			enableReinitialize
			onSubmit={(formData) => {
				onSubmit({
					...formData,
					clockInMorningTime: formData.clockInMorningTime.format('HH:mm:ss'),
					clockOutMorningTime: formData.clockOutMorningTime.format('HH:mm:ss'),
					clockInAfternoonTime: formData.clockInAfternoonTime.format(
						'HH:mm:ss',
					),
					clockOutAfternoonTime: formData.clockOutAfternoonTime.format(
						'HH:mm:ss',
					),
				});
			}}
		>
			<Form>
				<Divider className="mt-0" orientation="left">
					Morning
				</Divider>
				<Row gutter={[16, 16]}>
					<Col md={12}>
						<TimePickerField
							label="Clock In Morning"
							name="clockInMorningTime"
						/>
					</Col>
					<Col md={12}>
						<TimePickerField
							label="Clock Out Morning"
							name="clockOutMorningTime"
						/>
					</Col>
				</Row>

				<Divider orientation="left">Afternoon</Divider>
				<Row gutter={[16, 16]}>
					<Col md={12}>
						<TimePickerField
							label="Clock In Afternoon"
							name="clockInAfternoonTime"
						/>
					</Col>
					<Col md={12}>
						<TimePickerField
							label="Clock Out Afternoon"
							name="clockOutAfternoonTime"
						/>
					</Col>
				</Row>

				<div className="ModalCustomFooter">
					<Button disabled={loading} htmlType="button" onClick={onClose}>
						Cancel
					</Button>
					<Button htmlType="submit" loading={loading} type="primary">
						Set
					</Button>
				</div>
			</Form>
		</Formik>
	);
};

export const TimePickerField = ({ name, label }) => {
	const { values, setFieldValue } = useFormikContext();

	return (
		<>
			<Label label={label} spacing />
			<TimePicker
				allowClear={false}
				className="w-100"
				format="h:mm A"
				name={name}
				value={values[name]}
				hideDisabledOptions
				use12Hours
				onSelect={(value) => setFieldValue(name, value)}
			/>
			<ErrorMessage
				name={name}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);
};
