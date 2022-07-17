import { message, Modal } from 'antd';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { useUserCreate, useUserEdit } from 'hooks';
import React from 'react';
import { convertIntoArray } from 'utils';
import { ModifyUserForm } from './ModifyUserForm';

interface Props {
	user?: any;
	onSuccess?: any;
	branchUsersOnly?: boolean;
	onClose: any;
}

export const ModifyUserModal = ({
	user,
	branchUsersOnly,
	onSuccess,
	onClose,
}: Props) => {
	// METHODS
	const {
		mutateAsync: createUser,
		isLoading: isCreating,
		error: createError,
	} = useUserCreate();
	const {
		mutateAsync: editUser,
		isLoading: isEditing,
		error: editError,
	} = useUserEdit();

	const handleSubmit = async (formData) => {
		let response = null;
		if (user) {
			response = await editUser(formData);
			message.success('User was edited successfully');
		} else {
			response = await createUser(formData);
			message.success('User was created successfully');
		}

		onSuccess?.(response.data);
		onClose();
	};

	return (
		<Modal
			footer={null}
			title={`${user ? '[Edit]' : '[Create]'} User`}
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

			<ModifyUserForm
				branchUsersOnly={branchUsersOnly}
				isLoading={isCreating || isEditing}
				user={user}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
