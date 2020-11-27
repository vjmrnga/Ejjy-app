import { call, put, retry, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/branches-days';
import { MAX_PAGE_SIZE, MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/branches-days';

/* WORKERS */
function* list({ payload }: any) {
	const { branch_id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(MAX_RETRY, RETRY_INTERVAL_MS, service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			branch_id,
		});
		yield put(actions.save({ type: types.LIST_BRANCH_DAYS, branchDays: response.data.results }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getBranchDay({ payload }: any) {
	const { branch_id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(MAX_RETRY, RETRY_INTERVAL_MS, service.get, { branch_id });
		yield put(actions.save({ type: types.GET_BRANCH_DAY, branchDay: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { callback, branch_id, started_by_id } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.create, { branch_id, started_by_id });
		yield put(actions.save({ type: types.CREATE_BRANCH_DAY, branchDay: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { callback, id, ended_by_id } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.edit, id, { ended_by_id });
		yield put(actions.save({ type: types.EDIT_BRANCH_DAY, branchDay: response.data }));
		callback({ status: request.SUCCESS });
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
