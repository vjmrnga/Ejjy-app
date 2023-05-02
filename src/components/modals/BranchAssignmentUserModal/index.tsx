import { Button, Col, message, Modal, Select } from 'antd';
import { RequestErrors } from 'components';
import { FieldError, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { useBranchAssignmentCreate } from 'hooks';
import React, { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { convertIntoArray, filterOption, getId } from 'utils';
import * as Yup from 'yup';

interface Props {
	user: any;
	branches: any;
	onClose: any;
}

export const BranchAssignmentUserModal = ({
	user,
	branches,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const queryClient = useQueryClient();
	const {
		mutateAsync: createBranchAssignment,
		isLoading: isCreatingBranchAssignment,
		error: createBranchAssignmentError,
	} = useBranchAssignmentCreate();

	const handleSubmit = async (formData) => {
		await createBranchAssignment(formData);
		queryClient.invalidateQueries('useUsers');

		message.success('User was reassigned to a branch successfully');
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
				errors={convertIntoArray(createBranchAssignmentError?.errors)}
				withSpaceBottom
			/>

			<BranchAssignmentUserForm
				branches={branches}
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
	branches: any;
	isLoading: boolean;
	onSubmit: any;
	onClose: any;
}

export const BranchAssignmentUserForm = ({
	user,
	branches,
	isLoading,
	onSubmit,
	onClose,
}: FormProps) => {
	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				userId: getId(user),
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
							filterOption={filterOption}
							optionFilterProp="children"
							value={values['branchId']}
							showSearch
							onChange={(value) => {
								setFieldValue('branchId', value);
							}}
						>
							{branches.map((branch) => (
								<Select.Option key={getId(branch)} value={getId(branch)}>
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
						<Button disabled={isLoading} htmlType="button" onClick={onClose}>
							Cancel
						</Button>
						<Button htmlType="submit" loading={isLoading} type="primary">
							Submit
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};
