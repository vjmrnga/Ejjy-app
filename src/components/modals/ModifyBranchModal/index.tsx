import { Button, Col, Input, message, Modal, Row } from 'antd';
import { RequestErrors } from 'components';
import { ErrorMessage, Form, Formik } from 'formik';
import { useBranchCreate, useBranchEdit } from 'hooks';
import React, { useCallback } from 'react';
import { convertIntoArray, getId } from 'utils';
import * as Yup from 'yup';
import { FieldError, Label } from '../../elements';

interface Props {
	branch: any;
	onClose: any;
	onSuccess: any;
}

export const ModifyBranchModal = ({ branch, onClose, onSuccess }: Props) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: createBranch,
		isLoading: isCreatingBranch,
		error: createBranchError,
	} = useBranchCreate();
	const {
		mutateAsync: editBranch,
		isLoading: isEditingBranch,
		error: editBranchError,
	} = useBranchEdit();

	// METHODS
	const handleSubmit = async (formData) => {
		if (branch) {
			await editBranch({
				id: getId(branch),
				...formData,
			});
			message.success('Branch was edited successfully');
		} else {
			await createBranch(formData);
			message.success('Branch was created successfully');
		}

		onSuccess?.();
		onClose();
	};

	return (
		<Modal
			footer={null}
			title={`${branch ? '[Edit]' : '[Create]'} Branch`}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(createBranchError?.errors),
					...convertIntoArray(editBranchError?.errors),
				]}
				withSpaceBottom
			/>

			<ModifyBranchForm
				branch={branch}
				isLoading={isCreatingBranch || isEditingBranch}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};

interface FormProps {
	branch?: any;
	isLoading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyBranchForm = ({
	branch,
	isLoading,
	onSubmit,
	onClose,
}: FormProps) => {
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				name: branch?.name || '',
				serverUrl: branch?.server_url || '',
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(75).label('Name'),
				serverUrl: Yup.string().required().label('Server URL'),
			}),
		}),
		[branch],
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
					</Row>

					<div className="ModalCustomFooter">
						<Button disabled={isLoading} htmlType="button" onClick={onClose}>
							Cancel
						</Button>
						<Button htmlType="submit" loading={isLoading} type="primary">
							{branch ? 'Edit' : 'Create'}
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};
