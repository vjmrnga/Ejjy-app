import { Modal } from 'antd';
import React from 'react';
import { RequestErrors } from '../../../../components';
import { request } from '../../../../global/types';
import { convertIntoArray } from '../../../../utils/function';
import { useUsers } from '../../../../hooks/useUsers';
import { CreateUserForm } from './CreateUserForm';

interface Props {
	visible: boolean;
	onSuccess: any;
	onClose: any;
}

export const CreateUserModal = ({ visible, onSuccess, onClose }: Props) => {
	// CUSTOM HOOKS
	const { createUser, status: userStatus, errors, reset } = useUsers();

	// METHODS
	const onCreateUser = (data) => {
		createUser(data, ({ status }) => {
			if (status === request.SUCCESS) {
				onSuccess(data.user_type);
				reset();
				onClose();
			}
		});
	};

	return (
		<Modal
			title="Create User"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<CreateUserForm
				onSubmit={onCreateUser}
				onClose={onClose}
				loading={userStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
