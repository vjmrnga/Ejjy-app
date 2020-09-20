import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../../ducks/BranchPersonnel/preparation-slips';
import { MAX_PAGE_SIZE } from '../../global/constants';
import { request } from '../../global/types';
import { service } from '../../services/BranchPersonnel/preparation-slips';

/* WORKERS */
function* list({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
		});

		yield put(
			actions.save({ type: types.GET_PREPARATION_SLIPS, preparationSlips: response.data.results }),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* listExtended({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
		});

		yield put(
			actions.save({
				type: types.GET_PREPARATION_SLIPS_EXTENDED,
				preparationSlips: response.data.results,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.create, data);

		yield put(
			actions.save({ type: types.CREATE_PREPARATION_SLIP, preparationSlip: response.data }),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.edit, data);

		yield put(actions.save({ type: types.EDIT_PREPARATION_SLIP, preparationSlip: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listesWatcherSaga() {
	yield takeLatest(types.GET_PREPARATION_SLIPS, list);
};

const listExtendedWatcherSaga = function* listExtendedWatcherSaga() {
	yield takeLatest(types.GET_PREPARATION_SLIPS_EXTENDED, listExtended);
};

const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE_PREPARATION_SLIP, create);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT_PREPARATION_SLIP, edit);
};

export default [
	listWatcherSaga(),
	listExtendedWatcherSaga(),
	createWatcherSaga(),
	editWatcherSaga(),
];
