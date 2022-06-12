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
			title={`${branch ? '[Edit]' : '[Create]'} Branch`}
			visible
			footer={null}
			onCancel={onClose}
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

			<ModifyBranchForm
				branch={branch}
				isLoading={isCreatingBranch || isEditingBranch}
				onSubmit={handleSubmit}
				onClose={onClose}
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
				id: branch?.id || undefined,
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
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="Name" spacing />
							<Input
								name="name"
								value={values['name']}
								size="large"
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
								size="large"
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
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={isLoading}
						/>
						<Button
							type="submit"
							text={branch ? 'Edit' : 'Create'}
							variant="primary"
							loading={isLoading}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
