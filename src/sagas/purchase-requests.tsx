import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/purchase-requests';
import { MAX_PAGE_SIZE, request } from '../global/variables';
import { service } from '../services/purchase-requests';

/* WORKERS */
function* getPurchaseRequests({ payload }: any) {
	const { id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			id,
		});

		yield put(
			actions.save({ type: types.GET_PURCHASE_REQUESTS, purchaseRequests: response.data.results }),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getPurchaseRequestsExtended({ payload }: any) {
	const { id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.listExtended, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			id,
		});
		console.log(response.data.results);
		yield put(
			actions.save({
				type: types.GET_PURCHASE_REQUESTS_EXTENDED,
				purchaseRequests: response.data.results,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* createPurchaseRequest({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.createPurchaseRequest, data);

		yield put(
			actions.save({ type: types.CREATE_PURCHASE_REQUEST, purchaseRequest: response.data }),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getPurchaseRequestsWatcherSaga = function* getPurchaseRequestsWatcherSaga() {
	yield takeLatest(types.GET_PURCHASE_REQUESTS, getPurchaseRequests);
};

const getPurchaseRequestsExtendedWatcherSaga = function* getPurchaseRequestsExtendedWatcherSaga() {
	yield takeLatest(types.GET_PURCHASE_REQUESTS_EXTENDED, getPurchaseRequestsExtended);
};

const createPurchaseRequestWatcherSaga = function* createPurchaseRequestWatcherSaga() {
	yield takeLatest(types.CREATE_PURCHASE_REQUEST, createPurchaseRequest);
};

export default [
	getPurchaseRequestsWatcherSaga(),
	getPurchaseRequestsExtendedWatcherSaga(),
	createPurchaseRequestWatcherSaga(),
];
