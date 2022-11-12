import {
	APP_LOCAL_API_URL_KEY,
	APP_LOCAL_BRANCH_ID_KEY,
	APP_ONLINE_API_URL_KEY,
	APP_ONLINE_BRANCH_ID_KEY,
	APP_PRINTER_FONT_FAMILY,
	APP_PRINTER_FONT_SIZE,
	APP_PRINTER_NAME,
	DEFAULT_FONT_FAMILY,
	DEFAULT_FONT_SIZE,
} from 'global';

export const getOnlineBranchId = () =>
	localStorage.getItem(APP_ONLINE_BRANCH_ID_KEY);

export const getLocalBranchId = () =>
	localStorage.getItem(APP_LOCAL_BRANCH_ID_KEY);

export const getLocalApiUrl = () => localStorage.getItem(APP_LOCAL_API_URL_KEY);

export const getOnlineApiUrl = () =>
	localStorage.getItem(APP_ONLINE_API_URL_KEY);

export const getGoogleApiUrl = () =>
	'https://ejjy-api-production-ftmuaasxva-de.a.run.app/v1';

export const getAppPrinterName = () => localStorage.getItem(APP_PRINTER_NAME);

export const getAppPrinterFontFamily = () =>
	localStorage.getItem(APP_PRINTER_FONT_FAMILY) || DEFAULT_FONT_FAMILY;

export const getAppPrinterFontSize = () =>
	localStorage.getItem(APP_PRINTER_FONT_SIZE) || DEFAULT_FONT_SIZE;
