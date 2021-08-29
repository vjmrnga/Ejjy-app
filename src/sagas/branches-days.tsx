import { call, select, takeLatest } from 'redux-saga/effects';
import { types } from '../ducks/branches-days';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { IS_APP_LIVE } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/branches-days';
import { getLocalIpAddress } from '../utils/function';

/* WORKERS */
function* list({ payload }: any) {
	const { page, pageSize, branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	const localURL = getLocalIpAddress();

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId && IS_APP_LIVE) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	const data = {
		page,
		page_size: pageSize,
	};

	let isFetchedFromBackupURL = false;

	try {
		let response = null;

		try {
			// Fetch in branch url
			response = yield call(
				service.list,
				data,
				IS_APP_LIVE ? baseURL : localURL,
			);
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
			warnings: isFetchedFromBackupURL
				? ['Data Source: Backup Server, data might be outdated.']
				: [],
			data: response.data,
		});
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getBranchDay({ payload }: any) {
	const { branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId && IS_APP_LIVE) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	const localURL = getLocalIpAddress();

	try {
		const response = yield call(service.get, IS_APP_LIVE ? baseURL : localURL);
		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { branchId, startedById, onlineStartedById, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId && IS_APP_LIVE) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	const localURL = getLocalIpAddress();

	try {
		const response = yield call(
			service.create,
			{ started_by_id: startedById, online_started_by_id: onlineStartedById },
			IS_APP_LIVE ? baseURL : localURL,
		);

		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { id, branchId, endedById, onlineEndedById, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId && IS_APP_LIVE) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	const localURL = getLocalIpAddress();

	try {
		const response = yield call(
			service.edit,
			id,
			{ ended_by_id: endedById, online_ended_by_id: onlineEndedById },
			IS_APP_LIVE ? baseURL : localURL,
		);

		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST_BRANCH_DAYS, list);
};

const getBranchDayWatcherSaga = function* getBranchDayWatcherSaga() {
	yield takeLatest(types.GET_BRANCH_DAY, getBranchDay);
};

const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE_BRANCH_DAY, create);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT_BRANCH_DAY, edit);
};

export default [
	listWatcherSaga(),
	getBranchDayWatcherSaga(),
	createWatcherSaga(),
	editWatcherSaga(),
];
