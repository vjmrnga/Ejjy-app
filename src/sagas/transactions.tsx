import { call, select, takeEvery } from 'redux-saga/effects';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { types } from '../ducks/transactions';
import { request } from '../global/types';
import { service } from '../services/transactions';
import { getBaseUrl } from './helper';

/* WORKERS */
function* list({ payload }: any) {
	const {
		page,
		pageSize,
		branchId,
		statuses,
		timeRange,
		serverUrl,
		branchMachineId,
		callback,
	} = payload;
	callback({ status: request.REQUESTING });

	const baseURL = serverUrl || getBaseUrl(branchId, callback);

	const data = {
		statuses,
		time_range: timeRange,
		page,
		page_size: pageSize,
	};

	let isFetchedFromBackupURL = false;

	try {
		let response = null;

		try {
			// Fetch in branch url
			response = yield call(service.list, data, baseURL);
		} catch (e) {
			// Retry to fetch in backup branch url
			const baseBackupURL = getBaseUrl(null, callback);

			if (baseURL && baseBackupURL) {
				// Fetch branch url
				data['branch_machine_id'] = branchMachineId;
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
	yield takeEvery(types.LIST_TRANSACTIONS, list);
};

export default [listWatcherSaga()];
