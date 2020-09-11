import { Popconfirm } from 'antd';
import React from 'react';
import { EditButtonIcon, RemoveButtonIcon } from '../../ButtonIcons/ButtonIcons';
import './style.scss';

interface Props {
	onEdit?: any;
	onRemove?: any;
}

export const TableActions = ({ onEdit, onRemove }: Props) => (
	<div className="TableActions">
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
