import { Modal } from 'antd';
import React from 'react';
import { request } from '../../../../global/types';
import { useBackOrders } from '../../../../hooks/useBackOrders';
import { AssignBackOrderForm } from './AssignBackOrderForm';

interface Props {
	backOrder: any;
	onSuccess: any;
	onClose: any;
}

export const AssignBackOrderModal = ({
	backOrder,
	onSuccess,
	onClose,
}: Props) => {
	// VARIABLES
	const title = (
		<>
			<span>Assign Back Order</span>
			<span className="ModalTitleMainInfo">{backOrder?.id}</span>
		</>
	);

	// STATES
	const { editBackOrder, status: backOrdersStatus } = useBackOrders();

	// METHODS
	const onAssignBackOrder = (data) => {
		editBackOrder(
			{
				id: backOrder.id,
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
			<AssignBackOrderForm
				backOrder={backOrder}
				onSubmit={onAssignBackOrder}
				onClose={onClose}
				loading={backOrdersStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
