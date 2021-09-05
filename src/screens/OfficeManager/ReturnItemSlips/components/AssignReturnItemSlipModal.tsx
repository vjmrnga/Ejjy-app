import { Modal } from 'antd';
import React from 'react';
import { request } from '../../../../global/types';
import { useReturnItemSlips } from '../../../../hooks/useReturnItemSlips';
import { AssignReturnItemSlipForm } from './AssignReturnItemSlipForm';

interface Props {
	returnItemSlip: any;
	onSuccess: any;
	onClose: any;
}

export const AssignReturnItemSlipModal = ({
	returnItemSlip,
	onSuccess,
	onClose,
}: Props) => {
	// VARIABLES
	const title = (
		<>
			<span>Assign Return Item Slip</span>
			<span className="ModalTitleMainInfo">{returnItemSlip?.id}</span>
		</>
	);

	// STATES
	const { editReturnItemSlip, status: returnItemSlipsStatus } =
		useReturnItemSlips();

	// METHODS
	const onAssignReturnItemSlip = (data) => {
		editReturnItemSlip(
			{
				id: returnItemSlip.id,
				receiverId: data.receiver_id,
			},
			({ status }) => {
				if (status === request.SUCCESS) {
					onSuccess();
					onClose();
				}
			},
		);
	};

	return (
		<Modal
			title={title}
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<AssignReturnItemSlipForm
				onSubmit={onAssignReturnItemSlip}
				onClose={onClose}
				loading={returnItemSlipsStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
