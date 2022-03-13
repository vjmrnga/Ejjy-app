import { Modal } from 'antd';
import React from 'react';
import { RequestErrors } from '../../../../../components/RequestErrors/RequestErrors';
import { orderOfPaymentPurposes } from '../../../../../global/types';
import { useAuth } from '../../../../../hooks/useAuth';
import { useOrderOfPaymentsCreate } from '../../../../../hooks/useOrderOfPayments';
import { convertIntoArray } from '../../../../../utils/function';
import { CreateOrderOfPaymentForm } from './CreateOrderOfPaymentForm';

interface Props {
	onSuccess: any;
	onClose: any;
}

export const CreateOrderOfPaymentModal = ({ onSuccess, onClose }: Props) => {
	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		mutateAsync: createOrderOfPayment,
		isLoading,
		error,
	} = useOrderOfPaymentsCreate();

	// METHODS
	const onCreate = async (formData) => {
		await createOrderOfPayment({
			createdById: user.id,
			payorId: formData.payorId,
			amount: formData.amount,
			purpose: formData.purpose,
			extraDescription:
				formData.purpose === orderOfPaymentPurposes.OTHERS
					? formData.purposeOthers
					: undefined,
			chargeSalesTransactionId: formData.chargeSalesTransactionId || undefined,
		});
		onSuccess();
		onClose();
	};

	return (
		<Modal
			className="CreateOrderOfPaymentModal"
			title="[Create] Order of Payment"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

			<CreateOrderOfPaymentForm
				loading={isLoading}
				onSubmit={onCreate}
				onClose={onClose}
			/>
		</Modal>
	);
};
