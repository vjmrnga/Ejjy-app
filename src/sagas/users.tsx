import {
	call,
	put,
	retry,
	select,
	takeEvery,
	takeLatest,
} from 'redux-saga/effects';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { actions, types } from '../ducks/OfficeManager/users';
import {
	MAX_PAGE_SIZE,
	MAX_RETRY,
	RETRY_INTERVAL_MS,
} from '../global/constants';
import { request } from '../global/types';
import { ONLINE_API_URL } from '../services/index';
import { service } from '../services/users';
import { getBaseUrl } from './helper';

/* WORKERS */
function* listUsers({ payload }: any) {
	const { branchId, userType, callback } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = getBaseUrl(branchId, callback);

	const data = {
		page: 1,
		page_size: MAX_PAGE_SIZE,
		user_type: userType,
	};

	let isFetchedFromBackupURL = false;

	try {
		let response = null;

		try {
			// Fetch in branch url
			response = yield call(service.list, data, baseURL);
		} catch (e) {
			// Retry to fetch in backup branch url
			const baseBackupURL = yield select(
				branchesSelectors.selectBackUpURLByBranchId(branchId),
			);
			if (baseURL && baseBackupURL) {
				// Fetch branch url
				response = yield call(service.list, data, baseBackupURL);
				isFetchedFromBackupURL = true;
			} else {
				throw e;
			}
		}

		callback({
			status: request.SUCCESS,
			data: response.data,
			warnings: isFetchedFromBackupURL
				? ['Data Source: Backup Server, data might be outdated.']
				: [],
		});
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* listOnlineUsers({ payload }: any) {
	const {
		branchId,
		userType,
		isPendingCreateApproval,
		isPendingUpdateUserTypeApproval,
		callback,
	} = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(
			service.listOnline,
			{
				page: 1,
				page_size: MAX_PAGE_SIZE,
				branch_id: branchId,
				user_type: userType,
				is_pending_create_approval: isPendingCreateApproval,
				is_pending_update_user_type_approval: isPendingUpdateUserTypeApproval,
			},
			ONLINE_API_URL,
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getByIdOnline({ payload }: any) {
	const { id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.getByIdOnline,
			id,
			ONLINE_API_URL,
		);

		yield put(
			actions.save({ type: types.GET_USER_BY_ID, user: response.data }),
		);
		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getById({ payload }: any) {
	const { id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.getByIdOnline,
			id,
			ONLINE_API_URL,
		);

		yield put(
			actions.save({ type: types.GET_USER_BY_ID, user: response.data }),
		);
		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* createOnline({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.createOnline, data, ONLINE_API_URL);

		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* editOnline({ payload }: any) {
	const { id, branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(
			service.editOnline,
			id,
			{ branch_id: branchId },
			ONLINE_API_URL,
		);

		yield put(actions.save({ type: types.EDIT_USER, id }));
		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* remove({ payload }: any) {
	const { id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.removeOnline, id, ONLINE_API_URL);

		yield put(actions.save({ type: types.REMOVE_USER, id }));
		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* approve({ payload }: any) {
	const { id, pendingApprovalType, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(
			service.approveOnline,
			id,
			{
				pending_approval_type: pendingApprovalType,
			},
			ONLINE_API_URL,
		);

		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* requestUserTypeChange({ payload }: any) {
	const { id, newUserType, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(
			service.requestUserTypeChange,
			id,
			{ new_user_type: newUserType },
			ONLINE_API_URL,
		);

		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listUsersWatcherSaga = function* listUsersWatcherSaga() {
	yield takeLatest(types.GET_USERS, listUsers);
};

const listOnlineUsersWatcherSaga = function* listOnlineUsersWatcherSaga() {
	yield takeEvery(types.GET_ONLINE_USERS, listOnlineUsers);
};

const getByIdWatcherSaga = function* getByIdWatcherSaga() {
	yield takeLatest(types.GET_USER_BY_ID, getById);
};

const getByIdOnlineWatcherSaga = function* getByIdOnlineWatcherSaga() {
	yield takeLatest(types.GET_ONLINE_USER_BY_ID, getByIdOnline);
};

const createOnlineWatcherSaga = function* createOnlineWatcherSaga() {
	yield takeLatest(types.CREATE_USER, createOnline);
};

const editOnlineWatcherSaga = function* editOnlineWatcherSaga() {
	yield takeLatest(types.EDIT_USER, editOnline);
};

const removeWatcherSaga = function* removeWatcherSaga() {
	yield takeLatest(types.REMOVE_USER, remove);
};

const approveWatcherSaga = function* approveWatcherSaga() {
	yield takeLatest(types.APPROVE_USER, approve);
};

const requestUserTypeChangeWatcherSaga =
	function* requestUserTypeChangeWatcherSaga() {
		yield takeLatest(types.REQUEST_USER_TYPE_CHANGE, requestUserTypeChange);
	};

export default [
	listUsersWatcherSaga(),
	listOnlineUsersWatcherSaga(),
	getByIdWatcherSaga(),
	getByIdOnlineWatcherSaga(),
	createOnlineWatcherSaga(),
	editOnlineWatcherSaga(),
	removeWatcherSaga(),
	approveWatcherSaga(),
	requestUserTypeChangeWatcherSaga(),
];
