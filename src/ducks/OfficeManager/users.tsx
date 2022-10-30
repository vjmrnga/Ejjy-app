import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'OM_USERS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_USERS: `${key}/GET_USERS`,
	GET_ONLINE_USERS: `${key}/GET_ONLINE_USERS`,
	GET_USER_BY_ID: `${key}/GET_USER_BY_ID`,
	GET_ONLINE_USER_BY_ID: `${key}/GET_ONLINE_USER_BY_ID`,
	REMOVE_USER: `${key}/REMOVE_USER`,
	CREATE_USER: `${key}/CREATE_USER`,
	CREATE_ONLINE_USER: `${key}/CREATE_ONLINE_USER`,
	EDIT_USER: `${key}/EDIT_USER`,
	APPROVE_USER: `${key}/APPROVE_USER`,
	REQUEST_USER_TYPE_CHANGE: `${key}/REQUEST_USER_TYPE_CHANGE`,
};

const initialState = {
	user: {},
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_USER_BY_ID: {
					newData = { user: payload.user };
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
	getUsers: createAction(types.GET_USERS),
	getOnlineUsers: createAction(types.GET_ONLINE_USERS),
	getUserById: createAction(types.GET_USER_BY_ID),
	getOnlineUserById: createAction(types.GET_ONLINE_USER_BY_ID),
	createUser: createAction(types.CREATE_USER),
	createOnlineUser: createAction(types.CREATE_ONLINE_USER),
	editUser: createAction(types.EDIT_USER),
	removeUser: createAction(types.REMOVE_USER),
	requestUserTypeChange: createAction(types.REQUEST_USER_TYPE_CHANGE),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectUser: () => createSelector(selectState, (state) => state.user),
};

export default reducer;
