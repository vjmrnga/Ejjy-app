import { call, select, takeLatest } from 'redux-saga/effects';
import { types } from '../ducks/branches-days';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { request } from '../global/types';
import { BranchDaysService } from '../services';
import { getBaseUrl } from './helper';

/* WORKERS */
function* list({ payload }: any) {
	const {
		branchId,
		branchMachineId,
		callback,
		closedByUserId,
		isAutomaticallyClosed,
		isUnauthorized,
		openedByUserId,
		page,
		pageSize,
		serverUrl,
		timeRange,
	} = payload;
	callback({ status: request.REQUESTING });

	const baseURL = serverUrl || getBaseUrl(branchId, callback);

	const data = {
		branch_machine_id: branchMachineId,
		closed_by_user_id: closedByUserId,
		is_automatically_closed: isAutomaticallyClosed,
		is_unauthorized: isUnauthorized,
		opened_by_user_id: openedByUserId,
		page_size: pageSize,
		page,
		time_range: timeRange,
	};

	let isFetchedFromBackupURL = false;

	try {
		let response = null;

		try {
			// Fetch in branch url
			response = yield call(BranchDaysService.list, data, baseURL);
		} catch (e) {
			// Retry to fetch in backup branch url
			const baseBackupURL = yield select(
				branchesSelectors.selectBackUpURLByBranchId(branchId),
			);

			if (baseURL && baseBackupURL) {
				// Fetch branch url
				response = yield call(BranchDaysService.list, data, baseBackupURL);
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

	const baseURL = getBaseUrl(branchId, callback);

	try {
		const response = yield call(BranchDaysService.get, baseURL);
		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { branchId, startedById, onlineStartedById, callback } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = getBaseUrl(branchId, callback);

	try {
		const response = yield call(
			BranchDaysService.create,
			{ started_by_id: startedById, online_started_by_id: onlineStartedById },
			baseURL,
		);

		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { id, branchId, endedById, onlineEndedById, callback } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = getBaseUrl(branchId, callback);

	try {
		const response = yield call(
			BranchDaysService.edit,
			id,
			{ ended_by_id: endedById, online_ended_by_id: onlineEndedById },
			baseURL,
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
