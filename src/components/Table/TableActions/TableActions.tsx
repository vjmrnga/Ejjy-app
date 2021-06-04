import { Popconfirm } from 'antd';
import React from 'react';
import { AddButtonIcon, EditButtonIcon, RemoveButtonIcon } from '../../ButtonIcons/ButtonIcons';
import './style.scss';

interface Props {
	onExecutePendingTransaction?: any;
	onAdd?: any;
	onAssign?: any;
	onEdit?: any;
	onRemove?: any;
}

export const TableActions = ({
	onExecutePendingTransaction,
	onAdd,
	onAssign,
	onEdit,
	onRemove,
}: Props) => (
	<div className="TableActions">
		{onExecutePendingTransaction && (
			<AddButtonIcon onClick={onExecutePendingTransaction} tooltip="Execute" />
		)}
		{onAdd && <AddButtonIcon onClick={onAdd} tooltip="Add" />}
		{onAssign && <AddButtonIcon onClick={onAssign} tooltip="Assign" />}
		{onEdit && <EditButtonIcon onClick={onEdit} tooltip="Edit" />}
		{onRemove && (
			<Popconfirm
				placement="topLeft"
				title={'Are you sure to remove this?'}
				onConfirm={onRemove}
				okText="Yes"
				cancelText="No"
			>
				<RemoveButtonIcon onClick={null} tooltip="Remove" />
			</Popconfirm>
		)}
	</div>
);