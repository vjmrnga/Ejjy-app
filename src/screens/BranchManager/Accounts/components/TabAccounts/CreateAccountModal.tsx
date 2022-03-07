import { Modal } from 'antd';
import React from 'react';
import { RequestErrors } from '../../../../../components/RequestErrors/RequestErrors';
import { useAccountsCreate } from '../../../../../hooks';
import { convertIntoArray } from '../../../../../utils/function';
import { CreateAccountForm } from './CreateAccountForm';

interface Props {
	onSuccess: any;
	onClose: any;
}

export const CreateAccountModal = ({ onSuccess, onClose }: Props) => {
	// CUSTOM HOOKS
	const { mutateAsync: createAccount, isLoading, error } = useAccountsCreate();

	// METHODS
	const onCreate = async (formData) => {
		await createAccount(formData);
		onSuccess();
		onClose();
	};

	return (
		<Modal
			title="[Create] Account"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

			<CreateAccountForm
				loading={isLoading}
				onSubmit={onCreate}
				onClose={onClose}
			/>
		</Modal>
	);
};
