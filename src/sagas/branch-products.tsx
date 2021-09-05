import { call, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { types } from '../ducks/branch-products';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { request } from '../global/types';
import { service } from '../services/branch-products';
import { getLocalIpAddress } from '../utils/function';

/* WORKERS */
function* list({ payload }: any) {
	const {
		page,
		pageSize,
		branchId,
		search,
		isSoldInBranch,
		productIds,
		productStatus,
		productCategory,
		callback,
	} = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
		return;
	}

	const localURL = getLocalIpAddress();

	const data = {
		page,
		page_size: pageSize,
		search,
		product_ids: productIds,
		is_sold_in_branch: isSoldInBranch,
		product_status: productStatus,
		product_category: productCategory,
	};

	let isFetchedFromBackupURL = false;

	try {
		let response = null;

		try {
			// Fetch in branch url
			response = yield call(service.list, data, baseURL || localURL);
		} catch (e) {
			// Retry to fetch in backup branch url
			const baseBackupURL = yield select(
				branchesSelectors.selectBackUpURLByBranchId(branchId),
			);
			if (baseURL && baseBackupURL) {
				// Fetch branch url
				response = yield call(service.list, data, baseBackupURL);
				isFetchedFromBackupURL = true;
			} else {
				throw e;
			}
		}

		callback({
			status: request.SUCCESS,
			warnings: isFetchedFromBackupURL
				? ['Data Source: Backup Server, data might be outdated.']
				: [],
			data: response.data,
		});
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* listWithAnalytics({ payload }: any) {
	const {
		page,
		pageSize,
		branchId,
		productIds,
		sorting,
		productCategory,
		timeRange,
		isSoldInBranch,
		callback,
	} = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
		return;
	}

	const localURL = getLocalIpAddress();

	const data = {
		page,
		page_size: pageSize,
		product_ids: productIds,
		sorting,
		product_category: productCategory,
		time_range: timeRange,
		is_sold_in_branch: isSoldInBranch,
	};

	let isFetchedFromBackupURL = false;

	try {
		let response = null;

		try {
			// Fetch in branch url
			response = yield call(
				service.listWithAnalytics,
				data,
				baseURL || localURL,
			);
		} catch (e) {
			// Retry to fetch in backup branch url
			const baseBackupURL = yield select(
				branchesSelectors.selectBackUpURLByBranchId(branchId),
			);
			if (baseURL && baseBackupURL) {
				// Fetch branch url
				response = yield call(service.listWithAnalytics, data, baseBackupURL);
				isFetchedFromBackupURL = true;
			} else {
				throw e;
			}
		}

		callback({
			status: request.SUCCESS,
			warnings: isFetchedFromBackupURL
				? ['Data Source: Backup Server, data might be outdated.']
				: [],
			data: response.data,
		});
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* get({ payload }: any) {
	const { page, pageSize, branchId, productIds, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
		return;
	}

	const localURL = getLocalIpAddress();

	const data = {
		page,
		page_size: pageSize,
		product_ids: productIds,
	};

	let isFetchedFromBackupURL = false;

	try {
		let response = null;

		try {
			// Fetch in branch url
			response = yield call(service.list, data, baseURL || localURL);
		} catch (e) {
			// Retry to fetch in backup branch url
			const baseBackupURL = yield select(
				branchesSelectors.selectBackUpURLByBranchId(branchId),
			);
			if (baseURL && baseBackupURL) {
				// Fetch branch url
				response = yield call(service.list, data, baseBackupURL);
				isFetchedFromBackupURL = true;
			} else {
				throw e;
			}
		}

		callback({
			status: request.SUCCESS,
			warnings: isFetchedFromBackupURL
				? ['Data Source: Backup Server, data might be outdated.']
				: [],
			data: response.data,
		});
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { callback, branchId, ...data } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
		return;
	}

	try {
		const response = yield call(service.edit, data, baseURL);
		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* editBalance({ payload }: any) {
	const { callback, branchId, productId, updatingUserId, addedBalance } =
		payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
		return;
	}

	try {
		const response = yield call(
			service.editBalance,
			{
				product_id: productId,
				added_balance: addedBalance,
				destination_branch_id: branchId,
				updating_user_id: updatingUserId,
			},
			baseURL,
		);
		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* editPriceCost({ payload }: any) {
	const {
		callback,
		branchId,
		productId,
		costPerPiece,
		costPerBulk,
		pricePerPiece,
		pricePerBulk,
	} = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
		return;
	}

	try {
		const response = yield call(
			service.editPriceCost,
			{
				product_id: productId,
				cost_per_piece: costPerPiece,
				cost_per_bulk: costPerBulk,
				price_per_piece: pricePerPiece,
				price_per_bulk: pricePerBulk,
			},
			baseURL,
		);
		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeEvery(types.GET_BRANCH_PRODUCTS, list);
};

const listWithAnalyticsWatcherSaga = function* listWithAnalyticsWatcherSaga() {
	yield takeLatest(types.GET_BRANCH_PRODUCTS_WITH_ANALYTICS, listWithAnalytics);
};

const getWatcherSaga = function* getWatcherSaga() {
	yield takeEvery(types.GET_BRANCH_PRODUCT, get);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT_BRANCH_PRODUCT, edit);
};

const editBalanceWatcherSaga = function* editBalanceWatcherSaga() {
	yield takeLatest(types.EDIT_BRANCH_PRODUCT_BALANCE, editBalance);
};

const editPriceCostWatcherSaga = function* editPriceCostWatcherSaga() {
	yield takeEvery(types.EDIT_BRANCH_PRODUCT_PRICE_COST, editPriceCost);
};

export default [
	listWatcherSaga(),
	listWithAnalyticsWatcherSaga(),
	getWatcherSaga(),
	editWatcherSaga(),
	editBalanceWatcherSaga(),
	editPriceCostWatcherSaga(),
];
