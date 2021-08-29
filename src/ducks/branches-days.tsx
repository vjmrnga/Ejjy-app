import { createAction } from 'redux-actions';

export const key = 'BM_BRANCHES_DAYS';

export const types = {
	SAVE: `${key}/SAVE`,
	LIST_BRANCH_DAYS: `${key}/LIST_BRANCH_DAYS`,
	GET_BRANCH_DAY: `${key}/GET_BRANCH_DAY`,
	CREATE_BRANCH_DAY: `${key}/CREATE_BRANCH_DAY`,
	EDIT_BRANCH_DAY: `${key}/EDIT_BRANCH_DAY`,
};

export const actions = {
	save: createAction(types.SAVE),
	listBranchDays: createAction(types.LIST_BRANCH_DAYS),
	getBranchDay: createAction(types.GET_BRANCH_DAY),
	createBranchDay: createAction(types.CREATE_BRANCH_DAY),
	editBranchDay: createAction(types.EDIT_BRANCH_DAY),
};
