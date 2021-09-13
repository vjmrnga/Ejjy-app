import { call, retry, takeEvery, takeLatest } from 'redux-saga/effects';
import { types } from '../../ducks/Admin/logs';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../../global/constants';
import { request } from '../../global/types';
import { service } from '../../services/Admin/logs';
import { ONLINE_API_URL } from '../../services/index';

/* WORKERS */
function* listLogs({ payload }: any) {
	const { page, pageSize, branchId, actingUserId, timeRange, callback } =
		payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				page,
				page_size: pageSize,
				branch_id: branchId,
				acting_user_id: actingUserId,
				time_range: timeRange,
			},
			ONLINE_API_URL,
		);

		callback({
			status: request.SUCCESS,
			data: response.data,
		});
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getCount({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.getCount, ONLINE_API_URL);
		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listLogsWatcherSaga = function* listLogsWatcherSaga() {
	yield takeLatest(types.LIST_LOGS, listLogs);
};

const getCountWatcherSaga = function* getCountWatcherSaga() {
	yield takeEvery(types.GET_COUNT, getCount);
};

export default [listLogsWatcherSaga(), getCountWatcherSaga()];
