import { createAction } from 'redux-actions';

export const key = 'SITE_SETTINGS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_SITE_SETTINGS: `${key}/GET_SITE_SETTINGS`,
	EDIT_SITE_SETTINGS: `${key}/EDIT_SITE_SETTINGS`,
};

export const actions = {
	save: createAction(types.SAVE),
	getSiteSettings: createAction(types.GET_SITE_SETTINGS),
	editSiteSettings: createAction(types.EDIT_SITE_SETTINGS),
};
