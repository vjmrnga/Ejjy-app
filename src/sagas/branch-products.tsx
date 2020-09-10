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
	const { branch_id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.getBranchProductsByBranch, branch_id);
		yield put(
			actions.save({
				type: types.GET_BRANCH_PRODUCTS_BY_BRANCH,
				branchProducts: response.data.results,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* createBranchProduct({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.createBranchProduct, data);

		yield put(actions.save({ type: types.CREATE_BRANCH_PRODUCT, branchProduct: response.data }));
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

function* removeBranchProduct({ payload }: any) {
	const { callback, id } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(service.removeBranchProduct, id);

		yield put(actions.save({ type: types.REMOVE_BRANCH_PRODUCT, id }));
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

const createBranchProductWatcherSaga = function* createBranchProductWatcherSaga() {
	yield takeLatest(types.CREATE_BRANCH_PRODUCT, createBranchProduct);
};

const editBranchProductWatcherSaga = function* editBranchProductWatcherSaga() {
	yield takeLatest(types.EDIT_BRANCH_PRODUCT, editBranchProduct);
};

const removeBranchProductWatcherSaga = function* removeBranchProductWatcherSaga() {
	yield takeLatest(types.REMOVE_BRANCH_PRODUCT, removeBranchProduct);
};

export default [
	getBranchProductsWatcherSaga(),
	getBranchProductsByBranchWatcherSaga(),
	createBranchProductWatcherSaga(),
	editBranchProductWatcherSaga(),
	removeBranchProductWatcherSaga(),
];
