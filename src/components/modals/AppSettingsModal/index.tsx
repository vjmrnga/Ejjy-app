import { message, Modal } from 'antd';
import {
	APP_BRANCH_ID_KEY,
	APP_LOCAL_API_URL_KEY,
	APP_ONLINE_API_URL_KEY,
	APP_PRINTER_NAME,
} from 'global';
import React from 'react';
import {
	getAppPrinterName,
	getBranchId,
	getLocalApiUrl,
	getOnlineApiUrl,
} from 'utils';
import { AppSettingsForm } from './AppSettingsForm';

interface Props {
	onSuccess: any;
	onClose: any;
}

export const AppSettingsModal = ({ onSuccess, onClose }: Props) => {
	const handleSubmit = (formData) => {
		localStorage.setItem(APP_BRANCH_ID_KEY, formData.branchId);
		localStorage.setItem(APP_LOCAL_API_URL_KEY, formData.localApiUrl);
		localStorage.setItem(APP_ONLINE_API_URL_KEY, formData.onlineApiUrl);
		localStorage.setItem(APP_PRINTER_NAME, formData.printerName);

		message.success('App settings were updated successfully');
		onSuccess?.();
		onClose();
	};

	return (
		<Modal
			className="Modal"
			footer={null}
			title="App Settings"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<AppSettingsForm
				branchId={getBranchId()}
				localApiUrl={getLocalApiUrl()}
				onlineApiUrl={getOnlineApiUrl()}
				printerName={getAppPrinterName()}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
