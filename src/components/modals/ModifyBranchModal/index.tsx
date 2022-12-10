import { Col, Input, message, Modal, Row } from 'antd';
import { RequestErrors } from 'components';
import { ErrorMessage, Form, Formik } from 'formik';
import { useBranchCreate, useBranchEdit } from 'hooks';
import React, { useCallback } from 'react';
import { convertIntoArray } from 'utils';
import * as Yup from 'yup';
import { Button, FieldError, Label } from '../../elements';

interface Props {
	branch: any;
	onClose: any;
}

export const ModifyBranchModal = ({ branch, onClose }: Props) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: createBranch,
		isLoading: isCreatingBranch,
		error: createError,
	} = useBranchCreate();
	const {
		mutateAsync: editBranch,
		isLoading: isEditingBranch,
		error: editError,
	} = useBranchEdit();

	// METHODS
	const handleSubmit = async (formData) => {
		if (branch) {
			await editBranch(formData);
			message.success('Branch was edited successfully');
		} else {
			await createBranch(formData);
			message.success('Branch was created successfully');
		}

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
					...convertIntoArray(createError?.errors),
					...convertIntoArray(editError?.errors),
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
				id: branch?.online_id || undefined,
				name: branch?.name || '',
				onlineUrl: branch?.online_url || '',
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(75).label('Name'),
				onlineUrl: Yup.string().required().label('Online URL'),
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
							<Label label="Online URL" spacing />
							<Input
								name="onlineUrl"
								value={values['onlineUrl']}
								onChange={(e) => {
									setFieldValue('onlineUrl', e.target.value);
								}}
							/>
							<ErrorMessage
								name="onlineUrl"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							disabled={isLoading}
							text="Cancel"
							type="button"
							onClick={onClose}
						/>
						<Button
							loading={isLoading}
							text={branch ? 'Edit' : 'Create'}
							type="submit"
							variant="primary"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
