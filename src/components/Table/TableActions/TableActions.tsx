import { Popconfirm } from 'antd';
import React from 'react';
import {
	AddButtonIcon,
	EditButtonIcon,
	RemoveButtonIcon,
	ViewButtonIcon,
} from '../../ButtonIcons/ButtonIcons';
import './style.scss';

interface Props {
	onExecutePendingTransaction?: any;
	onView?: any;
	onViewName?: string;
	onAdd?: any;
	onAddName?: string;
	onAddIcon?: any;
	onAssign?: any;
	onEdit?: any;
	onRemove?: any;
}

export const TableActions = ({
	onExecutePendingTransaction,
	onView,
	onViewName,
	onAdd,
	onAddName,
	onAddIcon,
	onAssign,
	onEdit,
	onRemove,
}: Props) => (
	<div className="TableActions">
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
		{onRemove && (
			<Popconfirm
				placement="topLeft"
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
