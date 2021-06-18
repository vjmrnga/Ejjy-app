import { call, put, select, takeLatest } from 'redux-saga/effects';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { actions, types } from '../ducks/xread-reports';
import { IS_APP_LIVE } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/xread-reports';
import { getLocalIpAddress } from '../utils/function';

/* WORKERS */
function* create({ payload }: any) {
	const { branchMachineId, userId, branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	const localURL = getLocalIpAddress();

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	try {
		const response = yield call(
			service.create,
			{
				branch_machine_id: branchMachineId,
				user_id: userId,
			},
			IS_APP_LIVE ? baseURL : localURL,
		);

		yield put(actions.save({ type: types.CREATE_XREAD_REPORT, xreadReport: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE_XREAD_REPORT, create);
};

export default [createWatcherSaga()];
