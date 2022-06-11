// TODO: This needs to be refactored, content of this must be merged with order slip saga
import { retry, takeLatest } from 'redux-saga/effects';
import { types } from '../../ducks/OfficeManager/preparation-slips';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../../global/constants';
import { request } from '../../global/types';
import { getOnlineApiUrl } from 'utils';
import { service } from '../../services/order-slips';

/* WORKERS */
function* list({ payload }: any) {
	const { isPsForApproval, page, pageSize, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				is_ps_for_approval: isPsForApproval,
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

function* retrieve({ payload }: any) {
	const { id, requestingUserId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.retrieveWithAssignedPersonelDetails,
			id,
			{ requesting_user_id: requestingUserId },
			getOnlineApiUrl(),
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
function* listWatcher() {
	yield takeLatest(types.LIST, list);
}

function* retrieveWatcher() {
	yield takeLatest(types.RETRIEVE, retrieve);
}

export default [listWatcher(), retrieveWatcher()];
