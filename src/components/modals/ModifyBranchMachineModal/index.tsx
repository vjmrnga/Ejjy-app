import { Col, Modal } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { DetailsRow, RequestErrors } from '../..';
import { request } from '../../../global/types';
import { useBranchMachines } from '../../../hooks/useBranchMachines';
import { convertIntoArray, sleep } from '../../../utils/function';
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
		createBranchMachine,
		editBranchMachine,
		status: branchMachineStatus,
		errors,
	} = useBranchMachines();

	// METHODS
	const onSubmit = (formData) => {
		const modifyBranchMachine = branchMachine
			? editBranchMachine
			: createBranchMachine;

		modifyBranchMachine(formData, ({ status }) => {
			if (status === request.SUCCESS) {
				onClose();
			}
		});
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
			<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<ModifyBranchMachineForm
				branchMachine={branchMachine}
				loading={branchMachineStatus === request.REQUESTING}
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
				server_url: branchMachine?.server_url || '',
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(30).label('Name'),
				server_url: Yup.string().required().max(50).label('Server URL'),
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
						<FormInputLabel id="server_url" label="Server URL" />
						<ErrorMessage
							name="server_url"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
				</DetailsRow>

				<div className="ModalCustomFooter">
					<Button
						type="button"
						text="Cancel"
						onClick={onClose}
						classNames="mr-10"
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
