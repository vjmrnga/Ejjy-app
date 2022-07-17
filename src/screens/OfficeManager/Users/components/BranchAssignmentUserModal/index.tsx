import { Col, message, Modal, Select } from 'antd';
import { RequestErrors } from 'components';
import { Button, FieldError, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { useBranchAssignmentCreate, useBranches } from 'hooks';
import React, { useCallback } from 'react';
import { convertIntoArray } from 'utils';
import * as Yup from 'yup';

interface Props {
	user: any;
	onSuccess: any;
	onClose: any;
}

export const BranchAssignmentUserModal = ({
	user,
	onSuccess,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: createBranchAssignment,
		isLoading: isCreatingBranchAssignment,
		error: createError,
	} = useBranchAssignmentCreate();

	const handleSubmit = async (formData) => {
		await createBranchAssignment(formData);
		message.success('User was reassigned to a branch successfully');

		onSuccess();
		onClose();
	};

	return (
		<Modal
			footer={null}
			title="[Assign] User"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={convertIntoArray(createError?.errors)}
				withSpaceBottom
			/>

			<BranchAssignmentUserForm
				isLoading={isCreatingBranchAssignment}
				user={user}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};

interface FormProps {
	user: any;
	isLoading: boolean;
	onSubmit: any;
	onClose: any;
}

export const BranchAssignmentUserForm = ({
	user,
	isLoading,
	onSubmit,
	onClose,
}: FormProps) => {
	// CUSTOM HOOKS
	const {
		data: { branches },
		isFetching: isFetchingBranches,
	} = useBranches();

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				userId: user.id,
				branchId: user.branchId > 0 ? user.branchId : null, // NOTE: We want to display the valid branch IDs
			},
			Schema: Yup.object().shape({
				branchId: Yup.number().required().label('Branch'),
			}),
		}),
		[user],
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
					<Col span={24}>
						<Label label="Branch" spacing />
						<Select
							allowClear={false}
							className="w-100"
							filterOption={(input, option) =>
								option.children
									.toString()
									.toLowerCase()
									.indexOf(input.toLowerCase()) >= 0
							}
							loading={isFetchingBranches}
							optionFilterProp="children"
							size="large"
							value={values.branchId}
							showSearch
							onChange={(value) => {
								setFieldValue('branchId', value);
							}}
						>
							{branches.map((branch) => (
								<Select.Option key={branch.id} value={branch.id}>
									{branch.name}
								</Select.Option>
							))}
						</Select>
						<ErrorMessage
							name="branchId"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<div className="ModalCustomFooter">
						<Button text="Cancel" type="button" onClick={onClose} />
						<Button
							loading={isLoading}
							text="Submit"
							type="submit"
							variant="primary"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
