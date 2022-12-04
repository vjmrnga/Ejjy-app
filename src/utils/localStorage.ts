import {
	APP_APP_TYPE_KEY,
	APP_LOCAL_API_URL_KEY,
	APP_LOCAL_BRANCH_ID_KEY,
	APP_ONLINE_API_URL_KEY,
	APP_ONLINE_BRANCH_ID_KEY,
	APP_RECEIPT_PRINTER_FONT_FAMILY,
	APP_RECEIPT_PRINTER_FONT_SIZE,
	APP_RECEIPT_PRINTER_NAME,
	APP_TAG_PRINTER_FONT_FAMILY,
	APP_TAG_PRINTER_FONT_SIZE,
	APP_TAG_PRINTER_PAPER_HEIGHT,
	APP_TAG_PRINTER_PAPER_WIDTH,
	RECEIPT_DEFAULT_FONT_FAMILY,
	RECEIPT_DEFAULT_FONT_SIZE,
	TAG_DEFAULT_FONT_FAMILY,
	TAG_DEFAULT_FONT_SIZE,
	TAG_DEFAULT_PAPER_HEIGHT,
	TAG_DEFAULT_PAPER_WIDTH,
} from 'global';

export const getAppType = () => localStorage.getItem(APP_APP_TYPE_KEY);

export const getOnlineBranchId = () =>
	localStorage.getItem(APP_ONLINE_BRANCH_ID_KEY);

export const getLocalBranchId = () =>
	localStorage.getItem(APP_LOCAL_BRANCH_ID_KEY);

export const getLocalApiUrl = () => localStorage.getItem(APP_LOCAL_API_URL_KEY);

export const getOnlineApiUrl = () =>
	localStorage.getItem(APP_ONLINE_API_URL_KEY);

export const getGoogleApiUrl = () =>
	'https://ejjy-api-production-ftmuaasxva-de.a.run.app/v1';

export const getAppReceiptPrinterName = () =>
	localStorage.getItem(APP_RECEIPT_PRINTER_NAME);

export const getAppReceiptPrinterFontFamily = () =>
	localStorage.getItem(APP_RECEIPT_PRINTER_FONT_FAMILY) ||
	RECEIPT_DEFAULT_FONT_FAMILY;

export const getAppReceiptPrinterFontSize = () =>
	localStorage.getItem(APP_RECEIPT_PRINTER_FONT_SIZE) ||
	RECEIPT_DEFAULT_FONT_SIZE;

export const getAppTagPrinterPaperWidth = () =>
	localStorage.getItem(APP_TAG_PRINTER_PAPER_WIDTH) || TAG_DEFAULT_PAPER_WIDTH;

export const getAppTagPrinterPaperHeight = () =>
	localStorage.getItem(APP_TAG_PRINTER_PAPER_HEIGHT) ||
	TAG_DEFAULT_PAPER_HEIGHT;

export const getAppTagPrinterFontFamily = () =>
	localStorage.getItem(APP_TAG_PRINTER_FONT_FAMILY) || TAG_DEFAULT_FONT_FAMILY;

export const getAppTagPrinterFontSize = () =>
	localStorage.getItem(APP_TAG_PRINTER_FONT_SIZE) || TAG_DEFAULT_FONT_SIZE;
