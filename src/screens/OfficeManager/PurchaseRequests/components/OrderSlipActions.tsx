import React from 'react';
import { DeliverButtonIcon, EditButtonIcon, ViewButtonIcon } from '../../../../components';

interface Props {
	onView?: any;
	onEdit?: any;
	onCreateDR?: any;
}

export const OrderSlipActions = ({ onView, onEdit, onCreateDR }: Props) => (
	<div className="order-slip-actions">
		{onView && <ViewButtonIcon onClick={onView} tooltip="View" />}
		{onEdit && <EditButtonIcon onClick={onEdit} tooltip="Edit" />}
		{onCreateDR && <DeliverButtonIcon onClick={onCreateDR} tooltip="Create Delivery Receipt" />}
	</div>
);
