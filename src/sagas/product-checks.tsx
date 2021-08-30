import { call, put, retry, select, takeLatest } from 'redux-saga/effects';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { actions, types } from '../ducks/product-checks';
import { IS_APP_LIVE, MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/product-checks';
import { getLocalIpAddress } from '../utils/function';

/* WORKERS */
function* getProductChecks({ payload }: any) {
	const { type, branchId, isFilledUp, onlyOfToday, page, pageSize, callback } =
		payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId && IS_APP_LIVE) {
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
				page,
				page_size: pageSize,
				type,
				is_filled_up: isFilledUp,
				only_of_today: onlyOfToday,
			},
			IS_APP_LIVE ? baseURL : localURL,
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getProductCheckDaily({ payload }: any) {
	const { branchId, callback } = payload;
	callback({ status: request.REQUESTING });
	console.log('test');
	// Required: Branch must have an online URL
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId && IS_APP_LIVE) {
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
				page_size: 10,
				type: 'daily',
				is_filled_up: false,
				only_of_today: true,
			},
			IS_APP_LIVE ? baseURL : localURL,
		);
		console.log('test', response.data);
		callback({ status: request.SUCCESS, response: response.data.results?.[0] });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getProductCheck({ payload }: any) {
	const { id, branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId && IS_APP_LIVE) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
		return;
	}

	const localURL = getLocalIpAddress();

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.getById,
			id,
			IS_APP_LIVE ? baseURL : localURL,
		);

		callback({ status: request.SUCCESS, response: response.data });
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
	yield takeLatest(types.GET_PRODUCT_CHECKS, getProductChecks);
};

const getProductCheckDailyWatcherSaga =
	function* getProductCheckDailyWatcherSaga() {
		yield takeLatest(types.GET_PRODUCT_CHECK_DAILY, getProductCheckDaily);
	};

const getProductCheckWatcherSaga = function* getProductCheckWatcherSaga() {
	yield takeLatest(types.GET_PRODUCT_CHECK, getProductCheck);
};

const fulfillWatcherSaga = function* fulfillWatcherSaga() {
	yield takeLatest(types.FULFILL_PRODUCT_CHECK, fulfill);
};

export default [
	getProductChecksWatcherSaga(),
	getProductCheckWatcherSaga(),
	getProductCheckDailyWatcherSaga(),
	fulfillWatcherSaga(),
];
