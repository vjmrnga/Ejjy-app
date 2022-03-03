import { Modal } from 'antd';
import React from 'react';
import { RequestErrors } from '../../../../../components/RequestErrors/RequestErrors';
import { request } from '../../../../../global/types';
import { useProducts } from '../../../../../hooks/useProducts';
import { convertIntoArray } from '../../../../../utils/function';
import { CreateCreditRegistrationForm } from './CreateCreditRegistrationForm';

interface Props {
	onSuccess: any;
	onClose: any;
}

export const CreateCreditRegistrationModal = ({
	onSuccess,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const { status, errors } = useProducts();

	// METHODS
	const onCreate = (formData) => {
		onSuccess();
	};

	return (
		<Modal
			className="CreateCreditRegistrationModal"
			title="[Create] Credit Registration"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<CreateCreditRegistrationForm
				loading={status === request.REQUESTING}
				onSubmit={onCreate}
				onClose={onClose}
			/>
		</Modal>
	);
};
