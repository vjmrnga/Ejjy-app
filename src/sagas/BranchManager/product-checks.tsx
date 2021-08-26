import {
	call,
	put,
	retry,
	select,
	takeEvery,
	takeLatest,
} from 'redux-saga/effects';
import { actions, types } from '../../ducks/BranchManager/product-checks';
import { selectors as branchesSelectors } from '../../ducks/OfficeManager/branches';
import {
	IS_APP_LIVE,
	MAX_PAGE_SIZE,
	MAX_RETRY,
	RETRY_INTERVAL_MS,
} from '../../global/constants';
import { request } from '../../global/types';
import { service } from '../../services/BranchManager/product-checks';
import { getLocalIpAddress } from '../../utils/function';

/* WORKERS */
function* getProductChecks({ payload }: any) {
	const { type, assignedStoreId, isFilledUp, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL
	const baseURL = yield select(
		branchesSelectors.selectURLByBranchId(assignedStoreId),
	);
	if (!baseURL && assignedStoreId && IS_APP_LIVE) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
		return;
	}

	const localURL = getLocalIpAddress();

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				page: 1,
				page_size: MAX_PAGE_SIZE,
				type,
				is_filled_up: isFilledUp,
			},
			IS_APP_LIVE ? baseURL : localURL,
		);

		callback({ status: request.SUCCESS, response: response.data.results });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* fulfill({ payload }: any) {
	const { id, type, products, branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId && IS_APP_LIVE) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
		return;
	}

	const localURL = getLocalIpAddress();

	try {
		yield call(
			service.fulfill,
			id,
			{ products },
			IS_APP_LIVE ? baseURL : localURL,
		);
		yield put(
			actions.save({
				type: types.FULFILL_PRODUCT_CHECK,
				productCheckType: type,
				id,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getProductChecksWatcherSaga = function* getProductChecksWatcherSaga() {
	yield takeEvery(types.GET_PRODUCTS_CHECKS, getProductChecks);
};

const fulfillWatcherSaga = function* fulfillWatcherSaga() {
	yield takeLatest(types.FULFILL_PRODUCT_CHECK, fulfill);
};

export default [getProductChecksWatcherSaga(), fulfillWatcherSaga()];
