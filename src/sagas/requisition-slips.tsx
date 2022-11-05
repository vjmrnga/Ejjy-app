import { call, put, retry, select, takeLatest } from 'redux-saga/effects';
import { getGoogleApiUrl } from 'utils';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { actions, types } from '../ducks/requisition-slips';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import service from '../services/RequisitionSlipsService';

/* WORKERS */

function* getByIdAndBranch({ payload }: any) {
	const { id, branchId, isForOutOfStock, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	try {
		const response = yield call(
			service.getByIdAndBranch,
			{ preparing_branch_id: branchId },
			id,
			baseURL,
		);

		yield put(
			actions.save({
				type: types.GET_REQUISITION_SLIP_BY_ID_AND_BRANCH,
				branchId,
				requisitionSlip: response.data,
				isForOutOfStock,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getById({ payload }: any) {
	const { id, requestingUserType, callback } = payload;
	yield put(
		actions.save({
			type: types.GET_REQUISITION_SLIP_BY_ID,
			requisitionSlip: null,
		}),
	);

	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.getById,
			id,
			requestingUserType,
			getGoogleApiUrl(),
		);

		yield put(
			actions.save({
				type: types.GET_REQUISITION_SLIP_BY_ID,
				requisitionSlip: response.data,
			}),
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
		const response = yield call(service.edit, data, getGoogleApiUrl());

		yield put(
			actions.save({
				type: types.EDIT_REQUISITION_SLIP,
				requisitionSlip: response.data,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* setOutOfStock({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(service.edit, data, getGoogleApiUrl());
		yield put(actions.removeRequisitionSlipByBranch());
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getByIdWatcherSaga = function* getByIdWatcherSaga() {
	yield takeLatest(types.GET_REQUISITION_SLIP_BY_ID, getById);
};

const getByIdAndBranchWatcherSaga = function* getByIdAndBranchWatcherSaga() {
	yield takeLatest(
		types.GET_REQUISITION_SLIP_BY_ID_AND_BRANCH,
		getByIdAndBranch,
	);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT_REQUISITION_SLIP, edit);
};

const setOutOfStockWatcherSaga = function* setOutOfStockWatcherSaga() {
	yield takeLatest(types.SET_OUT_OF_STOCK, setOutOfStock);
};

export default [
	getByIdWatcherSaga(),
	getByIdAndBranchWatcherSaga(),
	editWatcherSaga(),
	setOutOfStockWatcherSaga(),
];
