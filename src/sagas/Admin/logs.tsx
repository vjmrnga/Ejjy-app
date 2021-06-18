import { retry, takeLatest } from 'redux-saga/effects';
import { types } from '../../ducks/Admin/logs';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../../global/constants';
import { request } from '../../global/types';
import { service } from '../../services/Admin/logs';
import { ONLINE_API_URL } from '../../services/index';

/* WORKERS */
function* getUpdateBranchProductBalanceLogs({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.getUpdateBranchProductBalanceLogs,
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

/* WATCHERS */
const getUpdateBranchProductBalanceLogsWatcherSaga =
	function* getUpdateBranchProductBalanceLogsWatcherSaga() {
		yield takeLatest(
			types.GET_UPDATE_BRANCH_PRODUCT_BALANCE_LOGS,
			getUpdateBranchProductBalanceLogs,
		);
	};

export default [getUpdateBranchProductBalanceLogsWatcherSaga()];
