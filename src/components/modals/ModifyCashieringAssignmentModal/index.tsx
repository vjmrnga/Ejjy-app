import { Col, message, Modal, Row, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { ErrorMessage, Form, Formik } from 'formik';
import {
	useAuth,
	useBranchMachines,
	useCashieringAssignmentCreate,
	useCashieringAssignmentEdit,
} from 'hooks';
import moment, { Moment } from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { convertIntoArray, filterOption } from 'utils';
import * as Yup from 'yup';
import { RequestErrors } from '../..';
import { Button, FieldError, Label } from '../../elements';

const setDateToTime = ({ assignment, date, times }) => {
	const selectedDate = assignment ? dayjs.tz(assignment.datetime_start) : date;
	const datetimeStart = times[0];
	const datetimeEnd = times[1];

	datetimeStart
		.date(selectedDate.date())
		.month(selectedDate.month())
		.year(selectedDate.year());
	datetimeEnd
		.date(selectedDate.date())
		.month(selectedDate.month())
		.year(selectedDate.year());

	return {
		datetimeStart,
		datetimeEnd,
	};
};

interface ModalProps {
	assignment?: any;
	assignments?: any;
	date?: any;
	userId: number;
	onClose: any;
}

export const ModifyCashieringAssignmentModal = ({
	assignment,
	assignments,
	date,
	userId,
	onClose,
}: ModalProps) => {
	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		data: { branchMachines },
		error: branchMachinesError,
	} = useBranchMachines();
	const {
		mutateAsync: createCashieringAssignment,
		isLoading: isCreateLoading,
		error: createError,
	} = useCashieringAssignmentCreate();
	const {
		mutateAsync: editCashieringAssignment,
		isLoading: isEditLoading,
		error: editError,
	} = useCashieringAssignmentEdit();

	// METHODS
	const handleSubmit = async (formData) => {
		const { datetimeStart, datetimeEnd } = setDateToTime({
			assignment,
			date,
			times: formData.times,
		});

		const data = {
			...formData,
			actingUserId: user.id,
			datetimeStart: datetimeStart.format('MM/DD/YYYY HH:mm:ss [GMT]'),
			datetimeEnd: datetimeEnd.format('MM/DD/YYYY HH:mm:ss [GMT]'),
			userId,
		};

		if (assignment) {
			await editCashieringAssignment(data);
			message.success('Cashiering assignment was created successfully');
		} else {
			await createCashieringAssignment(data);
			message.success('Cashiering assignment was edited successfully');
		}

		onClose();
	};

	return (
		<Modal
			title={`${
				assignment
					? '[Edit] Assignment'
					: `[Create] Assignment (${date.format('MMM D, YYYY')})`
			}`}
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors
				errors={[
					...convertIntoArray(createError?.errors),
					...convertIntoArray(editError?.errors),
					...convertIntoArray(branchMachinesError, 'Branch Machines'),
				]}
				withSpaceBottom
			/>

			<ModifyCashieringAssignmentForm
				assignment={assignment}
				assignments={assignments}
				branchMachines={branchMachines}
				date={date}
				loading={isCreateLoading || isEditLoading}
				onSubmit={handleSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};

interface FormProps {
	assignment?: any;
	assignments?: any;
	branchMachines: any;
	date?: any;
	loading: boolean;
	onClose: any;
	onSubmit: any;
}

export const ModifyCashieringAssignmentForm = ({
	assignment,
	assignments,
	branchMachines,
	date,
	loading,
	onClose,
	onSubmit,
}: FormProps) => {
	// STATES
	const [filteredAssignments, setFilteredAssignments] = useState([]);

	// METHODS
	useEffect(() => {
		const selectedDate = assignment
			? dayjs.tz(assignment.datetime_start)
			: date;

		setFilteredAssignments(
			assignments.filter(
				(ca) =>
					dayjs.tz(ca.datetime_start).isSame(selectedDate, 'date') &&
					ca.id !== assignment?.id,
			),
		);
	}, [assignment, assignments, date]);

	const getFormDetails = useCallback(() => {
		interface DefaultValues {
			id?: number;
			branchMachineId?: number;
			times?: [Moment, Moment];
		}

		const defaultValues: DefaultValues = {
			id: assignment?.id,
			branchMachineId: null,
			times: assignment
				? [
						moment(dayjs.tz(assignment.datetime_start).toDate()),
						moment(dayjs.tz(assignment.datetime_end).toDate()),
				  ]
				: null,
		};

		return {
			defaultValues,
			schema: Yup.object().shape({
				branchMachineId: !assignment
					? Yup.number().nullable().required().label('Branch Machine')
					: null,
				times: Yup.array()
					.nullable()
					.required()
					.label('Schedule')
					.test(
						'overlap',
						'Selected time overlaps existing assignments.',
						(times) => {
							if (filteredAssignments?.length > 0) {
								const { datetimeStart, datetimeEnd } = setDateToTime({
									assignment,
									date,
									times,
								});

								const hasOverlap = filteredAssignments.some((ca) => {
									const datetimeStartB = dayjs.tz(ca.datetime_start);
									const datetimeEndB = dayjs.tz(ca.datetime_end);

									return (
										datetimeStart <= datetimeEndB &&
										datetimeStartB <= datetimeEnd
									);
								});

								return !hasOverlap;
							}

							return true;
						},
					),
			}),
		};
	}, [assignment, filteredAssignments, date]);

	return (
		<Formik
			initialValues={getFormDetails().defaultValues}
			validationSchema={getFormDetails().schema}
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						{!assignment && (
							<Col span={24}>
								<Label label="Branch Machine" spacing />
								<Select
									size="large"
									className="w-100"
									onChange={(value) => {
										setFieldValue('branchMachineId', value);
									}}
									value={values.branchMachineId}
									optionFilterProp="children"
									filterOption={filterOption}
									showSearch
									allowClear
								>
									{branchMachines.map(({ id, name }) => (
										<Select.Option key={id} value={id}>
											{name}
										</Select.Option>
									))}
								</Select>
								<ErrorMessage
									name="branchMachineId"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
						)}

						<Col span={24}>
							<Label label="Schedule" spacing />
							<TimePicker.RangePicker
								size="large"
								className="w-100"
								onChange={(times: any) => {
									setFieldValue('times', times);
								}}
								value={values.times}
								format="h:mm A"
								hideDisabledOptions
								use12Hours
							/>
							<ErrorMessage
								name="times"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={loading}
						/>
						<Button
							type="submit"
							text={assignment ? 'Edit' : 'Create'}
							variant="primary"
							loading={loading}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
