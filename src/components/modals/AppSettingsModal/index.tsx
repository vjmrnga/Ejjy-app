import { message, Modal } from 'antd';
import {
	APP_BRANCH_ID_KEY,
	APP_LOCAL_API_URL_KEY,
	APP_ONLINE_API_URL_KEY,
} from 'global';
import React from 'react';
import { getBranchId, getLocalApiUrl, getOnlineApiUrl } from 'utils';
import { AppSettingsForm } from './AppSettingsForm';

interface Props {
	onSuccess: any;
	onClose: any;
}

export const AppSettingsModal = ({ onSuccess, onClose }: Props) => {
	const handleSubmit = (data) => {
		localStorage.setItem(APP_BRANCH_ID_KEY, data.branchId);
		localStorage.setItem(APP_LOCAL_API_URL_KEY, data.localApiUrl);
		localStorage.setItem(APP_ONLINE_API_URL_KEY, data.onlineApiUrl);

		message.success('App settings were updated successfully');
		onSuccess?.();
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
				branchId={getBranchId()}
				localApiUrl={getLocalApiUrl()}
				onlineApiUrl={getOnlineApiUrl()}
				onSubmit={handleSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};
