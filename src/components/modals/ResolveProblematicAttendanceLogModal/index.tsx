import { Button, Col, message, Modal, Row, TimePicker } from 'antd';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { ErrorMessage, Form, Formik } from 'formik';
import { useProblematicAttendanceLogResolve } from 'hooks';
import React from 'react';
import { convertIntoArray } from 'utils';
import * as Yup from 'yup';
import { FieldError, Label } from '../../elements';

const FormDetails = {
	defaultValues: {
		suggestedResolvedClockOutTime: null,
	},
	schema: Yup.object().shape({
		suggestedResolvedClockOutTime: Yup.string()
			.nullable()
			.required()
			.label('Suggested Resolved Clock Out Time'),
	}),
};

interface Props {
	problematicAttendanceLog: any;
	onClose: any;
}

export const ResolveProblematicAttendanceLogModal = ({
	problematicAttendanceLog,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: resolveProblematicAttendanceLog,
		isLoading: isResolvingProblematicAttendanceLog,
		error: resolveProblematicAttendanceLogError,
	} = useProblematicAttendanceLogResolve();

	// METHODS
	const handleSubmit = async (formData) => {
		await resolveProblematicAttendanceLog({
			id: problematicAttendanceLog.id,
			suggestedResolvedClockOutTime: formData,
		});

		message.success(
			'Problematic attendance log was submitted for approval successfully',
		);

		onClose();
	};

	return (
		<Modal
			footer={null}
			title="Resolve Problematic Attendance Log"
			width={400}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={convertIntoArray(resolveProblematicAttendanceLogError?.errors)}
				withSpaceBottom
			/>
			<ResolveProblematicAttendanceLogForm
				isLoading={isResolvingProblematicAttendanceLog}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};

const ResolveProblematicAttendanceLogForm = ({
	isLoading,
	onSubmit,
	onClose,
}) => (
	<Formik
		initialValues={FormDetails.defaultValues}
		validationSchema={FormDetails.schema}
		enableReinitialize
		onSubmit={(formData) => {
			onSubmit(formData.suggestedResolvedClockOutTime.format('HH:mm:ss'));
		}}
	>
		{({ values, setFieldValue }) => (
			<Form>
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<Label label="Suggested Resolved Clock Out Time" spacing />
						<TimePicker
							allowClear={false}
							className="w-100"
							format="h:mm A"
							value={values['suggestedResolvedClockOutTime']}
							hideDisabledOptions
							use12Hours
							onSelect={(value) =>
								setFieldValue('suggestedResolvedClockOutTime', value)
							}
						/>
						<ErrorMessage
							name="suggestedResolvedClockOutTime"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
				</Row>

				<div className="ModalCustomFooter">
					<Button disabled={isLoading} htmlType="button" onClick={onClose}>
						Cancel
					</Button>
					<Button htmlType="submit" loading={isLoading} type="primary">
						Submit
					</Button>
				</div>
			</Form>
		)}
	</Formik>
);
