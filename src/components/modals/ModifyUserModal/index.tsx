import { message, Modal } from 'antd';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { useUserCreate, useUserEdit } from 'hooks';
import React from 'react';
import { convertIntoArray } from 'utils';
import { ModifyUserForm } from './ModifyUserForm';

interface Props {
	user?: any;
	branchUsersOnly?: boolean;
	onClose: any;
}

export const ModifyUserModal = ({ user, branchUsersOnly, onClose }: Props) => {
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
		if (user) {
			await editUser(formData);
			message.success('User was edited successfully');
		} else {
			await createUser(formData);
			message.success('User was created successfully');
		}

		onClose();
	};

	return (
		<Modal
			title={`${user ? '[Edit]' : '[Create]'} User`}
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

			<ModifyUserForm
				user={user}
				branchUsersOnly={branchUsersOnly}
				isLoading={isCreating || isEditing}
				onSubmit={handleSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};
