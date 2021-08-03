import { Popconfirm } from 'antd';
import React from 'react';
import {
	AddButtonIcon,
	CheckButtonIcon,
	EditButtonIcon,
	RemoveButtonIcon,
	RestoreButtonIcon,
	ViewButtonIcon,
} from '../../ButtonIcons/ButtonIcons';
import './style.scss';

interface Props {
	onApprove?: any;
	onExecutePendingTransaction?: any;
	onView?: any;
	onViewName?: string;
	onAdd?: any;
	onAddName?: string;
	onAddIcon?: any;
	onAssign?: any;
	onEdit?: any;
	onRemove?: any;
	onRestore?: any;
}

export const TableActions = ({
	onApprove,
	onExecutePendingTransaction,
	onView,
	onViewName,
	onAdd,
	onAddName,
	onAddIcon,
	onAssign,
	onEdit,
	onRemove,
	onRestore,
}: Props) => (
	<div className="TableActions">
		{onApprove && <CheckButtonIcon onClick={onApprove} tooltip="Approve" />}
		{onExecutePendingTransaction && (
			<AddButtonIcon onClick={onExecutePendingTransaction} tooltip="Execute" />
		)}
		{onAdd && (
			<AddButtonIcon
				onClick={onAdd}
				tooltip={onAddName || 'Add'}
				imgSrc={onAddIcon}
			/>
		)}
		{onView && (
			<ViewButtonIcon onClick={onView} tooltip={onViewName || 'View'} />
		)}
		{onAssign && <AddButtonIcon onClick={onAssign} tooltip="Assign" />}
		{onEdit && <EditButtonIcon onClick={onEdit} tooltip="Edit" />}
		{onRestore && <RestoreButtonIcon onClick={onRestore} tooltip="Restore" />}
		{onRemove && (
			<Popconfirm
				placement="left"
				title="Are you sure to remove this?"
				onConfirm={onRemove}
				okText="Yes"
				cancelText="No"
			>
				<RemoveButtonIcon onClick={null} tooltip="Remove" />
			</Popconfirm>
		)}
	</div>
);
