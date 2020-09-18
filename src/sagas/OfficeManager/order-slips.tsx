import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../../ducks/OfficeManager/order-slips';
import { actions as purchaseRequestActions } from '../../ducks/purchase-requests';
import { MAX_PAGE_SIZE } from '../../global/constants';
import { request } from '../../global/types';
import { service } from '../../services/order-slips';

/* WORKERS */
function* getOrderSlips({ payload }: any) {
	const { purchase_request_id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			purchase_request_id,
		});

		yield put(actions.save({ type: types.GET_ORDER_SLIPS, orderSlips: response.data.results }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getOrderSlipsExtended({ payload }: any) {
	const { purchase_request_id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.listExtended, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			purchase_request_id,
		});

		yield put(
			actions.save({ type: types.GET_ORDER_SLIPS_EXTENDED, orderSlips: response.data.results }),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* createOrderSlip({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.createOrderSlip, data);

		yield put(actions.save({ type: types.CREATE_ORDER_SLIP, orderSlip: response.data }));
		yield put(
			purchaseRequestActions.removePurchaseRequestByBranch({ branchId: data.assigned_store_id }),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* editOrderSlip({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.updateOrderSlip, data);

		yield put(actions.save({ type: types.EDIT_ORDER_SLIP, orderSlip: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* removeOrderSlip({ payload }: any) {
	const { callback, id } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(service.removeOrderSlip, id);

		yield put(actions.save({ type: types.REMOVE_ORDER_SLIP, id }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getOrderSlipsWatcherSaga = function* getOrderSlipsWatcherSaga() {
	yield takeLatest(types.GET_ORDER_SLIPS, getOrderSlips);
};

const getOrderSlipsExtendedWatcherSaga = function* getOrderSlipsExtendedWatcherSaga() {
	yield takeLatest(types.GET_ORDER_SLIPS_EXTENDED, getOrderSlipsExtended);
};

const createOrderSlipWatcherSaga = function* createOrderSlipWatcherSaga() {
	yield takeLatest(types.CREATE_ORDER_SLIP, createOrderSlip);
};

const editOrderSlipWatcherSaga = function* editOrderSlipWatcherSaga() {
	yield takeLatest(types.EDIT_ORDER_SLIP, editOrderSlip);
};

const removeOrderSlipWatcherSaga = function* removeOrderSlipWatcherSaga() {
	yield takeLatest(types.REMOVE_ORDER_SLIP, removeOrderSlip);
};

export default [
	getOrderSlipsWatcherSaga(),
	getOrderSlipsExtendedWatcherSaga(),
	createOrderSlipWatcherSaga(),
	editOrderSlipWatcherSaga(),
	removeOrderSlipWatcherSaga(),
];
