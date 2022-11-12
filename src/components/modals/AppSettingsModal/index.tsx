import { message, Modal } from 'antd';

import {
	APP_LOCAL_API_URL_KEY,
	APP_ONLINE_API_URL_KEY,
	APP_ONLINE_BRANCH_ID_KEY,
	APP_PRINTER_FONT_FAMILY,
	APP_PRINTER_FONT_SIZE,
	APP_PRINTER_NAME,
} from 'global';
import { useAppType } from 'hooks';
import React from 'react';
import {
	getAppPrinterFontFamily,
	getAppPrinterFontSize,
	getAppPrinterName,
	getLocalApiUrl,
	getOnlineApiUrl,
	getOnlineBranchId,
} from 'utils';
import { AppSettingsForm } from './AppSettingsForm';

interface Props {
	onSuccess: any;
	onClose: any;
}

export const AppSettingsModal = ({ onSuccess, onClose }: Props) => {
	// CUSTOM HOOKS
	const { appType, setAppType } = useAppType();

	// METHODS
	const handleSubmit = (formData) => {
		localStorage.setItem(APP_ONLINE_BRANCH_ID_KEY, formData.branchId);
		localStorage.setItem(APP_LOCAL_API_URL_KEY, formData.localApiUrl);
		localStorage.setItem(APP_ONLINE_API_URL_KEY, formData.onlineApiUrl);
		localStorage.setItem(APP_PRINTER_FONT_FAMILY, formData.printerFontFamily);
		localStorage.setItem(APP_PRINTER_FONT_SIZE, formData.printerFontSize);
		localStorage.setItem(APP_PRINTER_NAME, formData.printerName);

		if (appType !== formData.appType) {
			setAppType(formData.appType);
		}

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
				appType={appType}
				branchId={getOnlineBranchId()}
				localApiUrl={getLocalApiUrl()}
				onlineApiUrl={getOnlineApiUrl()}
				printerFontFamily={getAppPrinterFontFamily()}
				printerFontSize={getAppPrinterFontSize()}
				printerName={getAppPrinterName()}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
