import { call, retry, takeLatest } from 'redux-saga/effects';
import { getOnlineApiUrl } from 'utils';
import { types } from '../ducks/preparation-slips';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/preparation-slips';

/* WORKERS */
function* list({ payload }: any) {
	const {
		assignedPersonnelId,
		isPsForApproval,
		requestingUserId,
		page,
		pageSize,
		callback,
	} = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				assigned_personnel_id: assignedPersonnelId,
				is_ps_for_approval: isPsForApproval,
				requesting_user_id: requestingUserId,
				page,
				page_size: pageSize,
			},
			getOnlineApiUrl(),
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getById({ payload }: any) {
	const { id, assignedPersonnelId, requestingUserId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.getById,
			id,
			{
				assigned_personnel_id: assignedPersonnelId,
				requesting_user_id: requestingUserId,
			},
			getOnlineApiUrl(),
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* fulfill({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.fulfill, data, getOnlineApiUrl());

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* approveOrDisapprove({ payload }: any) {
	const { id, isApproved, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(
			service.approveOrDisapprove,
			id,
			{
				is_approved: isApproved,
			},
			getOnlineApiUrl(),
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.GET_PREPARATION_SLIPS, list);
};

const getByIdWatcherSaga = function* getByIdWatcherSaga() {
	yield takeLatest(types.GET_PREPARATION_SLIP_BY_ID, getById);
};

const fulfillWatcherSaga = function* fulfillWatcherSaga() {
	yield takeLatest(types.FULFILL_PREPARATION_SLIP, fulfill);
};

const approveOrDisapproveWatcherSaga = function* approveOrDisapproveWatcherSaga() {
	yield takeLatest(
		types.APPROVE_OR_DISAPPROVE_PREPARATION_SLIP,
		approveOrDisapprove,
	);
};

export default [
	listWatcherSaga(),
	getByIdWatcherSaga(),
	fulfillWatcherSaga(),
	approveOrDisapproveWatcherSaga(),
];
