import { message, Modal } from 'antd';
import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { SettingUrlForm } from './SettingUrlForm';
import '../style.scss';

interface Props {
	visible: boolean;
	onClose: any;
}

export const SettingUrlModal = ({ visible, onClose }: Props) => {
	// CUSTOM HOOKS
	const { localIpAddress, updateLocalIpAddress } = useAuth();

	// METHODS
	const onSubmit = (data) => {
		updateLocalIpAddress(data.localIpAddress);
		message.success('Successfully updated the API URL.');
		onClose();
	};

	return (
		<Modal
			title="Set Local URL"
			className="SettingUrl"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<SettingUrlForm localIpAddress={localIpAddress} onSubmit={onSubmit} onClose={onClose} />
		</Modal>
	);
};
