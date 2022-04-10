import { message, Modal } from 'antd';
import React from 'react';
import { LOCAL_IP_ADDRESS_KEY } from '../../../../global/constants';
import { getLocalIpAddress } from '../../../../utils/function';
import '../style.scss';
import { SettingUrlForm } from './SettingUrlForm';

interface Props {
	visible: boolean;
	onClose: any;
}

export const SettingUrlModal = ({ visible, onClose }: Props) => {
	const onSubmit = (data) => {
		localStorage.setItem(LOCAL_IP_ADDRESS_KEY, data.localIpAddress);
		message.success('API URL was updated successfully');
		onClose();
	};

	return (
		<Modal
			title="Set Local URL"
			className="SettingUrl Modal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<SettingUrlForm
				localIpAddress={getLocalIpAddress()}
				onSubmit={onSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};
