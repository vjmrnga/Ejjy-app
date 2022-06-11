import { message, Modal } from 'antd';
import { LOCAL_IP_ADDRESS_KEY } from 'global';
import React from 'react';
import { getLocalIpAddress } from 'utils/function';
import { AppSettingsForm } from './AppSettingsForm';

interface Props {
	onClose: any;
}

export const AppSettingsModal = ({ onClose }: Props) => {
	const handleSubmit = (data) => {
		localStorage.setItem(LOCAL_IP_ADDRESS_KEY, data.localIpAddress);
		message.success('API URL was updated successfully');
		onClose();
	};

	return (
		<Modal
			title="App Settings"
			className="Modal"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<AppSettingsForm
				localIpAddress={getLocalIpAddress()}
				onSubmit={handleSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};
