export const API_URL_STAGING = 'https://ejjy-api-production-svjuxd2qva-as.a.run.app/v1';
export const API_URL_LOCAL = 'http://127.0.0.1:8000/v1';
export const API_URL = API_URL_LOCAL;
export const API_TIMEOUT = 5000;
export const request = {
	NONE: 0,
	REQUESTING: 1,
	SUCCESS: 2,
	ERROR: 3,
};

export const NO_VERIFICATION_NEEDED = 'NO_VERIFICATION_NEEDED';

export const NO_VERIFICATION_CONFIG = { params: NO_VERIFICATION_NEEDED };

export const MAX_PAGE_SIZE = 1000000;

// eslint-disable-next-line no-script-url
export const LINK_VOID = 'javascript:void(0)';

export const productTypes = {
	DRY: 'Dry',
	WET: 'Wet',
};

export const unitsOfMeasurement = {
	WEIGHING: 'Weighing',
	NON_WEIGHING: 'Non-Weighing',
};
