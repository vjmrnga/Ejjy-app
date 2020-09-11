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
	DRY: 'dry',
	WET: 'wet',
};

export const unitsOfMeasurement = {
	WEIGHING: 'weighing',
	NON_WEIGHING: 'non_weighing',
};

export const userTypes = {
	OFFICE_MANAGER: 'office_manager',
	BRANCH_MANAGER: 'branch_manager',
};

export const purchaseRequestActions = {
	NEW: 'new',
	SEEN: 'seen',
	F_OS1_CREATED: 'f_os1_created',
	F_OS1_PREPARED: 'f_os1_prepared',
	F_DS1_CREATED: 'f_ds1_created',
	F_DS1_DONE: 'f_ds1_done',
	F_DS1_ERROR: 'f_ds1_error',
};
