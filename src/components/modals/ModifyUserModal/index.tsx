import { message, Modal } from 'antd';
import { RequestErrors } from 'components/RequestErrors';
import {
	useUserCreate,
	useUserEdit,
	useUserRequestUserTypeChange,
} from 'hooks';
import React from 'react';
import { convertIntoArray, getId } from 'utils';
import { ModifyUserForm } from './ModifyUserForm';

interface Props {
	branchUsersOnly?: boolean;
	onClose: any;
	onSuccess?: any;
	user?: any;
}

export const ModifyUserModal = ({
	branchUsersOnly,
	onClose,
	onSuccess,
	user,
}: Props) => {
	// METHODS
	const {
		mutateAsync: createUser,
		isLoading: isCreatingUser,
		error: createUserError,
	} = useUserCreate();
	const {
		mutateAsync: editUser,
		isLoading: isEditingUser,
		error: editUserError,
	} = useUserEdit();
	const {
		mutateAsync: requestUserTypeChange,
		isLoading: isRequestingUserTypeChange,
		error: requestUserTypeChangeError,
	} = useUserRequestUserTypeChange();

	const handleSubmit = async (formData) => {
		let response = null;
		if (user) {
			response = await editUser({
				...formData,
				userType: undefined,
				id: getId(user),
			});

			console.log('formData.user_type', formData.userType);
			console.log('user.user_type', user.user_type);
			if (formData.userType !== user.user_type) {
				requestUserTypeChange({
					id: getId(user),
					newUserType: formData.userType,
				});
			}

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
					...convertIntoArray(createUserError?.errors),
					...convertIntoArray(editUserError?.errors),
					...convertIntoArray(requestUserTypeChangeError?.errors),
				]}
				withSpaceBottom
			/>

			<ModifyUserForm
				branchUsersOnly={branchUsersOnly}
				isLoading={
					isCreatingUser || isEditingUser || isRequestingUserTypeChange
				}
				user={user}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
