import { Modal } from 'antd';
import React from 'react';
import { request } from '../../../global/types';
import { useUsers } from '../../../hooks/useUsers';
import { convertIntoArray } from '../../../utils/function';
import { RequestErrors } from '../../RequestErrors/RequestErrors';
import { CreateUserForm } from './CreateUserForm';

interface Props {
	branchUsersOnly?: boolean;
	onSuccess: any;
	onClose: any;
}

export const CreateUserModal = ({
	branchUsersOnly,
	onSuccess,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const { createUser, status: userStatus, errors } = useUsers();

	// METHODS
	const onCreateUser = (data) => {
		createUser(data, ({ status }) => {
			if (status === request.SUCCESS) {
				onSuccess(data.user_type);
				onClose();
			}
		});
	};

	return (
		<Modal
			title="Create User"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<CreateUserForm
				branchUsersOnly={branchUsersOnly}
				loading={userStatus === request.REQUESTING}
				onSubmit={onCreateUser}
				onClose={onClose}
			/>
		</Modal>
	);
};
