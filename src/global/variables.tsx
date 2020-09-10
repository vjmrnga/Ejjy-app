export const API_URL = process.env.REACT_APP_API_URL;
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

export const NOT_FOUND_INDEX = -1;

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
