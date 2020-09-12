import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/branch-products';
import { MAX_PAGE_SIZE, request } from '../global/variables';
import { service } from '../services/branch-products';

/* WORKERS */
function* getBranchProducts({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
		});

		yield put(
			actions.save({ type: types.GET_BRANCH_PRODUCTS, branchProducts: response.data.results }),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* getBranchProductsByBranch({ payload }: any) {
	const { branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.getBranchProductsByBranch, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			branch_id: branchId,
		});

		yield put(
			actions.save({
				type: types.GET_BRANCH_PRODUCTS_BY_BRANCH,
				branchProducts: response.data,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* editBranchProduct({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.editBranchProduct, data);

		yield put(actions.save({ type: types.EDIT_BRANCH_PRODUCT, branchProduct: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}
/* WATCHERS */
const getBranchProductsWatcherSaga = function* getBranchProductsWatcherSaga() {
	yield takeLatest(types.GET_BRANCH_PRODUCTS, getBranchProducts);
};

const getBranchProductsByBranchWatcherSaga = function* getBranchProductsByBranchWatcherSaga() {
	yield takeLatest(types.GET_BRANCH_PRODUCTS_BY_BRANCH, getBranchProductsByBranch);
};

const editBranchProductWatcherSaga = function* editBranchProductWatcherSaga() {
	yield takeLatest(types.EDIT_BRANCH_PRODUCT, editBranchProduct);
};

export default [
	getBranchProductsWatcherSaga(),
	getBranchProductsByBranchWatcherSaga(),
	editBranchProductWatcherSaga(),
];
