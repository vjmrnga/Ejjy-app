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
	areButtonsDisabled?: boolean;
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
	areButtonsDisabled,
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
		{onApprove && (
			<CheckButtonIcon
				disabled={areButtonsDisabled}
				onClick={onApprove}
				tooltip="Approve"
			/>
		)}
		{onExecutePendingTransaction && (
			<AddButtonIcon
				disabled={areButtonsDisabled}
				onClick={onExecutePendingTransaction}
				tooltip="Execute"
			/>
		)}
		{onAdd && (
			<AddButtonIcon
				disabled={areButtonsDisabled}
				onClick={onAdd}
				tooltip={onAddName || 'Add'}
				imgSrc={onAddIcon}
			/>
		)}
		{onView && (
			<ViewButtonIcon
				disabled={areButtonsDisabled}
				onClick={onView}
				tooltip={onViewName || 'View'}
			/>
		)}
		{onAssign && (
			<AddButtonIcon
				disabled={areButtonsDisabled}
				onClick={onAssign}
				tooltip="Assign"
			/>
		)}
		{onEdit && (
			<EditButtonIcon
				disabled={areButtonsDisabled}
				onClick={onEdit}
				tooltip="Edit"
			/>
		)}
		{onRestore && (
			<RestoreButtonIcon
				disabled={areButtonsDisabled}
				onClick={onRestore}
				tooltip="Restore"
			/>
		)}
		{onRemove && (
			<Popconfirm
				placement="left"
				title="Are you sure to remove this?"
				onConfirm={onRemove}
				okText="Yes"
				cancelText="No"
			>
				<RemoveButtonIcon
					disabled={areButtonsDisabled}
					onClick={null}
					tooltip="Remove"
				/>
			</Popconfirm>
		)}
	</div>
);
