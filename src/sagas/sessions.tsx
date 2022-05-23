import { call, select, takeLatest } from 'redux-saga/effects';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { types } from '../ducks/sessions';
import { request } from '../global/types';
import { service } from '../services/sessions';
import { getBaseUrl } from './helper';

/* WORKERS */
function* list({ payload }: any) {
	const {
		branchId,
		branchMachineId,
		callback,
		isAutomaticallyClosed,
		isUnauthorized,
		page,
		pageSize,
		serverUrl,
		timeRange,
		userId,
	} = payload;
	callback({ status: request.REQUESTING });

	const baseURL = serverUrl || getBaseUrl(branchId, callback);

	const data = {
		branch_machine_id: branchMachineId,
		is_automatically_closed: isAutomaticallyClosed,
		is_unauthorized: isUnauthorized,
		page_size: pageSize,
		page,
		time_range: timeRange,
		user_id: userId,
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
			warnings: isFetchedFromBackupURL
				? ['Data Source: Backup Server, data might be outdated.']
				: [],
			data: response.data,
		});
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST_SESSIONS, list);
};

export default [listWatcherSaga()];
