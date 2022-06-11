import { Col, message, Modal, Row } from 'antd';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { ErrorMessage, Form, Formik } from 'formik';
import { usePointSystemTagCreate, usePointSystemTagEdit } from 'hooks';
import React, { useCallback } from 'react';
import { convertIntoArray } from 'utils';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormattedInputNumber,
	FormInputLabel,
	Label,
} from '../../elements';

interface ModalProps {
	pointSystemTag: any;
	onClose: any;
}

export const ModifyPointSystemTagModal = ({
	pointSystemTag,
	onClose,
}: ModalProps) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: createPointSystemTag,
		isLoading: isCreateLoading,
		error: createError,
	} = usePointSystemTagCreate();
	const {
		mutateAsync: editPointSystemTag,
		isLoading: isEditLoading,
		error: editError,
	} = usePointSystemTagEdit();

	// METHODS
	const onSubmit = async (formData) => {
		if (pointSystemTag) {
			await editPointSystemTag(formData);
			message.success('Point system tag was edited successfully');
		} else {
			await createPointSystemTag(formData);
			message.success('Point system tag was created successfully');
		}

		onClose();
	};

	return (
		<Modal
			title={`${pointSystemTag ? '[Edit]' : '[Create]'} Point System Tag`}
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
				]}
				withSpaceBottom
			/>

			<ModifyPointSystemTagForm
				pointSystemTag={pointSystemTag}
				isLoading={isCreateLoading || isEditLoading}
				onSubmit={onSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};

interface FormProps {
	pointSystemTag?: any;
	isLoading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyPointSystemTagForm = ({
	pointSystemTag,
	isLoading,
	onSubmit,
	onClose,
}: FormProps) => {
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: pointSystemTag?.id || undefined,
				name: pointSystemTag?.name || '',
				divisorAmount: pointSystemTag?.divisor_amount || '',
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(75).label('Name'),
				divisorAmount: Yup.string().required().label('Divisor Amount'),
			}),
		}),
		[pointSystemTag],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form className="form">
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<FormInputLabel id="name" label="Name" />
							<ErrorMessage
								name="name"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label id="divisorAmount" label="Divisor Amount" spacing />
							<FormattedInputNumber
								size="large"
								value={values.divisorAmount}
								controls={false}
								className="w-100"
								onChange={(value) => {
									setFieldValue('divisorAmount', value);
								}}
							/>
							<ErrorMessage
								name="divisorAmount"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={isLoading}
						/>
						<Button
							type="submit"
							text={pointSystemTag ? 'Edit' : 'Create'}
							variant="primary"
							loading={isLoading}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
