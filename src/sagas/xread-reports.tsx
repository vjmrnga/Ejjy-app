import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/xread-reports';
import { request } from '../global/types';
import { service } from '../services/xread-reports';

/* WORKERS */
function* create({ payload }: any) {
	const { branchMachineId, userId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.create, {
			branch_machine_id: branchMachineId,
			user_id: userId,
		});

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
