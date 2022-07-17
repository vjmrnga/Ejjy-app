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
				tooltip="Approve"
				onClick={onApprove}
			/>
		)}
		{onExecutePendingTransaction && (
			<AddButtonIcon
				disabled={areButtonsDisabled}
				tooltip="Execute"
				onClick={onExecutePendingTransaction}
			/>
		)}
		{onAdd && (
			<AddButtonIcon
				disabled={areButtonsDisabled}
				imgSrc={onAddIcon}
				tooltip={onAddName || 'Add'}
				onClick={onAdd}
			/>
		)}
		{onView && (
			<ViewButtonIcon
				disabled={areButtonsDisabled}
				tooltip={onViewName || 'View'}
				onClick={onView}
			/>
		)}
		{onAssign && (
			<AddButtonIcon
				disabled={areButtonsDisabled}
				tooltip="Assign"
				onClick={onAssign}
			/>
		)}
		{onEdit && (
			<EditButtonIcon
				disabled={areButtonsDisabled}
				tooltip="Edit"
				onClick={onEdit}
			/>
		)}
		{onRestore && (
			<RestoreButtonIcon
				disabled={areButtonsDisabled}
				tooltip="Restore"
				onClick={onRestore}
			/>
		)}
		{onRemove && (
			<Popconfirm
				cancelText="No"
				okText="Yes"
				placement="left"
				title="Are you sure to remove this?"
				onConfirm={onRemove}
			>
				<RemoveButtonIcon
					disabled={areButtonsDisabled}
					tooltip="Remove"
					onClick={null}
				/>
			</Popconfirm>
		)}
	</div>
);
