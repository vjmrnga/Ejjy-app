import { message, Modal } from 'antd';
import React, { useCallback } from 'react';
import { RequestErrors } from '../../../../components';
import { NO_BRANCH_ID } from '../../../../global/constants';
import { request } from '../../../../global/types';
import { useBranches } from '../../../../hooks/useBranches';
import { useUsers } from '../../../../hooks/useUsers';
import { convertIntoArray } from '../../../../utils/function';
import { EditUserForm } from './EditUserForm';

interface Props {
	visible: boolean;
	user: any;
	onFetchPendingTransactions: any;
	onSuccessEditUserBranch: any;
	onSuccessEditUserType: any;
	onClose: any;
}

export const EditUserModal = ({
	user,
	visible,
	onFetchPendingTransactions,
	onSuccessEditUserBranch,
	onSuccessEditUserType,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const { branches } = useBranches();
	const {
		editUser,
		requestUserTypeChange,
		status: userStatus,
		errors,
		reset,
	} = useUsers();

	// METHODS
	const getBranchOptions = useCallback(
		() => [
			{
				value: NO_BRANCH_ID,
				name: 'No Branch',
			},
			...branches
				.filter(({ online_url }) => !!online_url)
				.map(({ id, name }) => ({ value: id, name })),
		],
		[branches],
	);

	const onEditUserBranch = (data, resetForm) => {
		editUser(data, ({ status, response }) => {
			if (status === request.SUCCESS) {
				if (response?.length) {
					message.warning(
						'We found an error while updating the user in local branch. Please check the pending transaction table below.',
					);
					onFetchPendingTransactions();
				}

				onSuccessEditUserBranch(data.branchId);
				resetForm();
				close();
			}
		});
	};

	const onEditUserType = (data, resetForm) => {
		requestUserTypeChange(data, ({ status }) => {
			if (status === request.SUCCESS) {
				onSuccessEditUserType();
				resetForm();
				close();
			}
		});
	};

	const close = () => {
		reset();
		onClose();
	};

	return (
		<Modal
			title="Edit User"
			visible={visible}
			footer={null}
			onCancel={close}
			centered
			closable
		>
			<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<EditUserForm
				user={user}
				branchOptions={getBranchOptions()}
				onEditUserBranch={onEditUserBranch}
				onEditUserType={onEditUserType}
				onClose={onClose}
				loading={userStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
