import { Modal } from 'antd';
import { RequestErrors } from 'components/RequestErrors';
import { useReturnItemSlipEdit } from 'hooks';
import React from 'react';
import { convertIntoArray } from 'utils';
import { AssignReturnItemSlipForm } from './AssignReturnItemSlipForm';

interface Props {
	returnItemSlip: any;
	onClose: any;
}

export const AssignReturnItemSlipModal = ({
	returnItemSlip,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: editReturnItemSlip,
		isLoading: isEditingReturnItemSlip,
		error: editReturnItemSlipError,
	} = useReturnItemSlipEdit();

	// METHODS
	const handleSubmit = async (formData) => {
		await editReturnItemSlip({
			...formData,
			id: returnItemSlip.id, // TODO: Once the syncing of RIS, implement getId to this line.
		});

		onClose();
	};

	return (
		<Modal
			footer={null}
			title={
				<>
					<span>Assign Return Item Slip</span>
					<span className="ModalTitleMainInfo">{returnItemSlip?.id}</span>
				</>
			}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={convertIntoArray(editReturnItemSlipError?.errors)}
				withSpaceBottom
			/>

			<AssignReturnItemSlipForm
				loading={isEditingReturnItemSlip}
				returnItemSlip={returnItemSlip}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
