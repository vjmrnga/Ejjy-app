import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'SITE_SETTINGS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_SITE_SETTINGS: `${key}/GET_SITE_SETTINGS`,
	EDIT_SITE_SETTINGS: `${key}/EDIT_SITE_SETTINGS`,
};

const initialState = {
	siteSettings: null,
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_SITE_SETTINGS:
				case types.EDIT_SITE_SETTINGS: {
					newData = { siteSettings: payload.siteSettings };
					break;
				}
				default:
					break;
			}

			return { ...state, ...newData };
		},
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	getSiteSettings: createAction(types.GET_SITE_SETTINGS),
	editSiteSettings: createAction(types.EDIT_SITE_SETTINGS),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectSiteSettings: () =>
		createSelector(selectState, (state) => state.siteSettings),
};

export default reducer;
