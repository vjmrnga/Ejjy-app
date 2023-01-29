import { message, Modal } from 'antd';
import { RequestErrors } from 'components';
import { useAccountCreate, useAccountEdit } from 'hooks';
import React from 'react';
import { convertIntoArray } from 'utils';
import { ModifyAccountForm } from './ModifyAccountForm';

interface Props {
	account?: any;
	onSuccess: any;
	onClose: any;
}

export const ModifyAccountModal = ({ account, onSuccess, onClose }: Props) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: createAccount,
		isLoading: isCreating,
		error: createError,
	} = useAccountCreate();
	const {
		mutateAsync: editAccount,
		isLoading: isEditing,
		error: editError,
	} = useAccountEdit();

	// METHODS
	const handleSubmit = async (formData) => {
		if (account) {
			await editAccount({
				id: account.id,
				...formData,
			});
			message.success('Account was edited successfully.');
		} else {
			await createAccount(formData);
			message.success('Account was created successfully.');
		}

		onSuccess();
		onClose();
	};

	return (
		<Modal
			footer={null}
			title={`${account ? '[Edit]' : '[Create]'} Account`}
			width={600}
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

			<ModifyAccountForm
				account={account}
				loading={isCreating || isEditing}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
