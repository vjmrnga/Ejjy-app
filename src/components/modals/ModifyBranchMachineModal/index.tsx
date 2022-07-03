import { Col, message, Modal } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { useBranchMachineCreate, useBranchMachineEdit } from 'hooks';
import React, { useCallback, useState } from 'react';
import { convertIntoArray, getBranchId, sleep } from 'utils';
import * as Yup from 'yup';
import { DetailsRow, RequestErrors } from '../..';
import { Button, FieldError, FormInputLabel } from '../../elements';

interface ModalProps {
	branchId?: any;
	branchMachine: any;
	onClose: any;
}

export const ModifyBranchMachineModal = ({
	branchId,
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
				branchId={branchId}
				branchMachine={branchMachine}
				loading={isCreateLoading || isEditLoading}
				onSubmit={onSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};

interface FormProps {
	branchId?: any;
	branchMachine?: any;
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyBranchMachineForm = ({
	branchId,
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
				branchId: branchMachine?.branch?.id || branchId || getBranchId(),
				machineIdentificationNumber:
					branchMachine?.machine_identification_number || '',
				name: branchMachine?.name || '',
				permitToUse: branchMachine?.permit_to_use || '',
				posTerminal: branchMachine?.pos_terminal || '',
				serverUrl: branchMachine?.server_url || '',
			},
			Schema: Yup.object().shape({
				branchId: Yup.string().required().label('Branch ID'),
				machineIdentificationNumber: Yup.string()
					.required()
					.max(75)
					.label('Machine Identification Number'),
				name: Yup.string().required().max(30).label('Name'),
				permitToUse: Yup.string().required().max(75).label('Permit To Use'),
				posTerminal: Yup.string().required().max(75).label('Serial #'),
				serverUrl: Yup.string().required().max(75).label('Server URL'),
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
						<FormInputLabel
							id="machineIdentificationNumber"
							label="Machine Identification Number"
						/>
						<ErrorMessage
							name="machineIdentificationNumber"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Col xs={24}>
						<FormInputLabel id="permitToUse" label="Permit To Use" />
						<ErrorMessage
							name="permitToUse"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Col xs={24}>
						<FormInputLabel id="posTerminal" label="Serial #" />
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
