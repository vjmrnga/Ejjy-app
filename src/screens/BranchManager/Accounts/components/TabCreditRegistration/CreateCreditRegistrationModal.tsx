import { Modal } from 'antd';
import React from 'react';
import { RequestErrors } from '../../../../../components/RequestErrors/RequestErrors';
import { useCreditRegistrationsCreate } from '../../../../../hooks';
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
	const {
		mutateAsync: createCreditRegistration,
		isLoading,
		error,
	} = useCreditRegistrationsCreate();

	// METHODS
	const onCreate = async (formData) => {
		await createCreditRegistration(formData);
		onSuccess();
		onClose();
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
			<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

			<CreateCreditRegistrationForm
				loading={isLoading}
				onSubmit={onCreate}
				onClose={onClose}
			/>
		</Modal>
	);
};
