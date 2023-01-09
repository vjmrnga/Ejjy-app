import { Button, Col, Input, message, Modal, Row } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { useBranchMachineCreate, useBranchMachineEdit } from 'hooks';
import React, { useCallback } from 'react';
import { convertIntoArray } from 'utils';
import * as Yup from 'yup';
import { RequestErrors } from '../..';
import { FieldError, Label } from '../../elements';

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
				isLoading={isCreating || isEditing}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};

interface FormProps {
	branchId?: any;
	branchMachine?: any;
	isLoading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyBranchMachineForm = ({
	branchId,
	branchMachine,
	isLoading,
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
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="Name" spacing />
							<Input
								name="name"
								value={values['name']}
								onChange={(e) => {
									setFieldValue('name', e.target.value);
								}}
							/>
							<ErrorMessage
								name="name"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Server URL" spacing />
							<Input
								name="serverUrl"
								value={values['serverUrl']}
								onChange={(e) => {
									setFieldValue('serverUrl', e.target.value);
								}}
							/>
							<ErrorMessage
								name="serverUrl"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Machine Identification Number" spacing />
							<Input
								name="machineIdentificationNumber"
								value={values['machineIdentificationNumber']}
								onChange={(e) => {
									setFieldValue('machineIdentificationNumber', e.target.value);
								}}
							/>
							<ErrorMessage
								name="machineIdentificationNumber"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Permit To Use" spacing />
							<Input
								name="permitToUse"
								value={values['permitToUse']}
								onChange={(e) => {
									setFieldValue('permitToUse', e.target.value);
								}}
							/>
							<ErrorMessage
								name="permitToUse"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Serial #" spacing />
							<Input
								name="posTerminal"
								value={values['posTerminal']}
								onChange={(e) => {
									setFieldValue('posTerminal', e.target.value);
								}}
							/>
							<ErrorMessage
								name="posTerminal"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button disabled={isLoading} htmlType="button" onClick={onClose}>
							Cancel
						</Button>
						<Button htmlType="submit" loading={isLoading} type="primary">
							{branchMachine ? 'Edit' : 'Create'}
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};
