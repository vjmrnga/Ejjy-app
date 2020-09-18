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

export const unitOfMeasurementTypes = {
	WEIGHING: 'weighing',
	NON_WEIGHING: 'non_weighing',
};

export const userTypes = {
	OFFICE_MANAGER: 'office_manager',
	BRANCH_MANAGER: 'branch_manager',
	BRANCH_PERSONNEL: 'branch_personnel',
};

export const purchaseRequestTypes = {
	MANUAL: 'manual',
	AUTOMATIC: 'automatic',
};

export const purchaseRequestProductStatus = {
	ADDED_TO_OS: 'added_to_os',
	NOT_ADDED_TO_OS: 'not_added_to_os',
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

export const orderSlipStatus = {
	DELIVERED: 'delivered',
	PREPARING: 'preparing',
	PREPARED: 'prepared',
};
