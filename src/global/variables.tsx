import { upperFirst } from 'lodash';

export const API_URL = process.env.REACT_APP_API_URL;
export const API_TIMEOUT = 5000;

export const NO_VERIFICATION_NEEDED = 'NO_VERIFICATION_NEEDED';

export const NO_VERIFICATION_CONFIG = { params: NO_VERIFICATION_NEEDED };

export const MAX_PAGE_SIZE = 1000000;

export const NOT_FOUND_INDEX = -1;

// eslint-disable-next-line no-script-url
export const LINK_VOID = 'javascript:void(0)';

export const request = {
	NONE: 0,
	REQUESTING: 1,
	SUCCESS: 2,
	ERROR: 3,
};

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

export const purchaseRequestTypes = {
	MANUAL: 'manual',
	AUTOMATIC: 'automatic',
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

export const branchProductStatus = {
	AVAILABLE: 'available',
	REORDER: 'reorder',
	OUT_OF_STOCK: 'out_of_stock',
};

export const quantityTypes = {
	BULK: 'bulk',
	PIECE: 'piece',
};

export const quantityTypeOptions = [
	{
		name: upperFirst(quantityTypes.PIECE),
		value: quantityTypes.PIECE,
	},
	{
		name: upperFirst(quantityTypes.BULK),
		value: quantityTypes.BULK,
	},
];

export const purchaseRequestActionsOptions = [
	{
		value: 'all',
		name: 'All',
	},
	{
		value: purchaseRequestActions.NEW,
		name: 'New',
	},
	{
		value: purchaseRequestActions.SEEN,
		name: 'Seen',
	},
	{
		value: purchaseRequestActions.F_OS1_CREATED,
		name: 'F-OS1 Created',
	},
	{
		value: purchaseRequestActions.F_OS1_PREPARED,
		name: 'F-OS1 Prepared',
	},
	{
		value: purchaseRequestActions.F_DS1_CREATED,
		name: 'F-DS1 Created',
	},
	{
		value: purchaseRequestActions.F_DS1_DONE,
		name: 'F-DS1 Done',
	},
	{
		value: purchaseRequestActions.F_DS1_ERROR,
		name: 'F-DS1 Error',
	},
];
