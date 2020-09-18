import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/purchase-requests';
import { MAX_PAGE_SIZE } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/purchase-requests';

/* WORKERS */
function* getPurchaseRequests({ payload }: any) {
	const { id = null, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			branch_id: id,
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
	const { id = null, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.listExtended, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			branch_id: id,
		});

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

function* getPurchaseRequestByIdAndBranch({ payload }: any) {
	const { id, branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.listByIdAndBranch, { branch_id: branchId }, id);

		yield put(
			actions.save({
				type: types.GET_PURCHASE_REQUEST_BY_ID_AND_BRANCH,
				branchId,
				purchaseRequest: response.data,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getPurchaseRequestById({ payload }: any) {
	const { id, callback } = payload;
	yield put(
		actions.save({
			type: types.GET_PURCHASE_REQUEST_BY_ID,
			purchaseRequest: null,
		}),
	);

	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.listById, id);

		yield put(
			actions.save({
				type: types.GET_PURCHASE_REQUEST_BY_ID,
				purchaseRequest: response.data,
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

const getPurchaseRequestByIdWatcherSaga = function* getPurchaseRequestByIdWatcherSaga() {
	yield takeLatest(types.GET_PURCHASE_REQUEST_BY_ID, getPurchaseRequestById);
};

const getPurchaseRequestByIdAndBranchWatcherSaga = function* getPurchaseRequestByIdAndBranchWatcherSaga() {
	yield takeLatest(types.GET_PURCHASE_REQUEST_BY_ID_AND_BRANCH, getPurchaseRequestByIdAndBranch);
};

const createPurchaseRequestWatcherSaga = function* createPurchaseRequestWatcherSaga() {
	yield takeLatest(types.CREATE_PURCHASE_REQUEST, createPurchaseRequest);
};

export default [
	getPurchaseRequestsWatcherSaga(),
	getPurchaseRequestsExtendedWatcherSaga(),
	getPurchaseRequestByIdWatcherSaga(),
	getPurchaseRequestByIdAndBranchWatcherSaga(),
	createPurchaseRequestWatcherSaga(),
];
