import { Col, message, Modal } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { useBranchMachineCreate, useBranchMachineEdit } from 'hooks';
import React, { useCallback } from 'react';
import { convertIntoArray } from 'utils';
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
		isLoading: isCreating,
		error: createError,
	} = useBranchMachineCreate();
	const {
		mutateAsync: editBranchMachine,
		isLoading: isEditing,
		error: editError,
	} = useBranchMachineEdit();

	// METHODS
	const handleSubmit = async (formData) => {
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
			footer={null}
			title={`${branchMachine ? '[Edit]' : '[Create]'} Branch Machine`}
			centered
			closable
			visible
			onCancel={onClose}
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
				loading={isCreating || isEditing}
				onClose={onClose}
				onSubmit={handleSubmit}
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
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: branchMachine?.id || null,
				branchId: branchMachine?.branch?.id || branchId,
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
			enableReinitialize
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
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
						disabled={loading}
						text="Cancel"
						type="button"
						onClick={onClose}
					/>
					<Button
						loading={loading}
						text={branchMachine ? 'Edit' : 'Create'}
						type="submit"
						variant="primary"
					/>
				</div>
			</Form>
		</Formik>
	);
};
