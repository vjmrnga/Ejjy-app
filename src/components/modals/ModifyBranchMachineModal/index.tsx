import { Col, message, Modal } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { useBranchMachineCreate, useBranchMachineEdit } from 'hooks';
import React, { useCallback, useState } from 'react';
import { convertIntoArray, sleep } from 'utils';
import * as Yup from 'yup';
import { DetailsRow, RequestErrors } from '../..';
import { Button, FieldError, FormInputLabel } from '../../elements';

interface ModalProps {
	branchMachine: any;
	onClose: any;
}

export const ModifyBranchMachineModal = ({
	branchMachine,
	onClose,
}: ModalProps) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: createBranchMachine,
		isLoading: isCreateLoading,
		error: createError,
	} = useBranchMachineCreate();
	const {
		mutateAsync: editBranchMachine,
		isLoading: isEditLoading,
		error: editError,
	} = useBranchMachineEdit();

	// METHODS

	const onSubmit = async (formData) => {
		if (branchMachine) {
			await editBranchMachine(formData);
			message.success('Branch machine was edited successfully');
		} else {
			await createBranchMachine(formData);
			message.success('Branch machine was created successfully');
		}

		onClose();
	};

	return (
		<Modal
			title={`${branchMachine ? '[Edit]' : '[Create]'} Branch Machine`}
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

			<ModifyBranchMachineForm
				branchMachine={branchMachine}
				loading={isCreateLoading || isEditLoading}
				onSubmit={onSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};

interface FormProps {
	branchMachine?: any;
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyBranchMachineForm = ({
	branchMachine,
	loading,
	onSubmit,
	onClose,
}: FormProps) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: branchMachine?.id || null,
				name: branchMachine?.name || '',
				serverUrl: branchMachine?.server_url || '',
				posTerminal: branchMachine?.pos_terminal || '',
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(30).label('Name'),
				serverUrl: Yup.string().required().max(75).label('Server URL'),
				posTerminal: Yup.string().max(75).label('POS Terminal'),
			}),
		}),
		[branchMachine],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData) => {
				setSubmitting(true);
				await sleep(500);

				onSubmit(formData);
				setSubmitting(false);
			}}
			enableReinitialize
		>
			<Form className="form">
				<DetailsRow>
					<Col xs={24}>
						<FormInputLabel id="name" label="Name" />
						<ErrorMessage
							name="name"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Col xs={24}>
						<FormInputLabel id="serverUrl" label="Server URL" />
						<ErrorMessage
							name="serverUrl"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Col xs={24}>
						<FormInputLabel id="posTerminal" label="POS Terminal" />
						<ErrorMessage
							name="posTerminal"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
				</DetailsRow>

				<div className="ModalCustomFooter">
					<Button
						type="button"
						text="Cancel"
						onClick={onClose}
						disabled={loading || isSubmitting}
					/>
					<Button
						type="submit"
						text={branchMachine ? 'Edit' : 'Create'}
						variant="primary"
						loading={loading || isSubmitting}
					/>
				</div>
			</Form>
		</Formik>
	);
};
