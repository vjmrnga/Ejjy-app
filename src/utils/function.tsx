import { message } from 'antd';
import { request } from '../global/variables';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const showMessage = (status, successMessage, errorMessage) => {
	if (status === request.SUCCESS) {
		message.success(successMessage);
	} else if (status === request.ERROR) {
		message.error(errorMessage);
	}
};

export const modifiedCallback = (callback, successMessage, errorMessage) => {
	return (response) => {
		showMessage(response?.status, successMessage, errorMessage);
		callback(response);
	};
};
