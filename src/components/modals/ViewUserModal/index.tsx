import { Descriptions, Modal } from 'antd';
import { Button } from 'components/elements';
import React from 'react';
import { getUserTypeName } from 'utils';

interface Props {
	user: any;
	onClose: any;
}

export const ViewUserModal = ({ user, onClose }: Props) => (
	<Modal
		className="Modal__hasFooter"
		footer={[<Button key="button" text="Close" onClick={onClose} />]}
		title="User"
		centered
		closable
		visible
		onCancel={onClose}
	>
		<Descriptions className="w-100" column={1} bordered>
			<Descriptions.Item label="ID">{user.employee_id}</Descriptions.Item>

			<Descriptions.Item label="Username">{user.username}</Descriptions.Item>

			<Descriptions.Item label="First Name">
				{user.first_name}
			</Descriptions.Item>

			<Descriptions.Item label="Last Name">{user.last_name}</Descriptions.Item>

			<Descriptions.Item label="Email">{user.email}</Descriptions.Item>

			<Descriptions.Item label="Type">
				{getUserTypeName(user.user_type)}
			</Descriptions.Item>
		</Descriptions>
	</Modal>
);
