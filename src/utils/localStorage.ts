import {
	APP_BRANCH_ID_KEY,
	APP_LOCAL_API_URL_KEY,
	APP_ONLINE_API_URL_KEY,
	APP_PRINTER_NAME,
} from 'global';

export const getBranchId = () => localStorage.getItem(APP_BRANCH_ID_KEY);

export const getLocalApiUrl = () => localStorage.getItem(APP_LOCAL_API_URL_KEY);

export const getOnlineApiUrl = () =>
	localStorage.getItem(APP_ONLINE_API_URL_KEY);

export const getGoogleApiUrl = () =>
	'https://ejjy-api-production-ftmuaasxva-de.a.run.app/v1';

export const getAppPrinterName = () => localStorage.getItem(APP_PRINTER_NAME);
