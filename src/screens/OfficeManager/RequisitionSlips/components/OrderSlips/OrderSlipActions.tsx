import { Popconfirm } from 'antd';
import React from 'react';
import { DeliverButtonIcon, EditButtonIcon } from '../../../../../components';

interface Props {
	onEdit?: any;
	onCreateDR?: any;
}

export const OrderSlipActions = ({ onEdit, onCreateDR }: Props) => (
	<div className="order-slip-actions">
		{onEdit && <EditButtonIcon tooltip="Edit" onClick={onEdit} />}
		{onCreateDR && (
			<Popconfirm
				cancelText="Cancel"
				okText="Confirm"
				placement="topLeft"
				title="Please confirm the creation of delivery receipt for this order slip"
				onConfirm={onCreateDR}
			>
				<DeliverButtonIcon tooltip="Create Delivery Receipt" onClick={null} />
			</Popconfirm>
		)}
	</div>
);
