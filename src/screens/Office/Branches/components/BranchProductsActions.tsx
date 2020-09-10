import { Popconfirm } from 'antd';
import React from 'react';
import { EditButtonIcon, RemoveButtonIcon } from '../../../../components';

interface Props {
	onEdit: any;
	onRemove: any;
}

export const BranchProductsActions = ({ onEdit, onRemove }: Props) => (
	<>
		<EditButtonIcon onClick={onEdit} tooltip="Edit" />
		<Popconfirm
			placement="topLeft"
			title={'Are you sure to remove this product?'}
			onConfirm={onRemove}
			okText="Yes"
			cancelText="No"
		>
			<RemoveButtonIcon onClick={null} tooltip="Remove" classNames="ml-10" />
		</Popconfirm>
	</>
);
