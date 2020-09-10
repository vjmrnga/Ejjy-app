import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/products';
import { MAX_PAGE_SIZE, request } from '../global/variables';
import { service } from '../services/products';

/* WORKERS */
function* getProducts({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
		});

		yield put(actions.save({ type: types.GET_PRODUCTS, products: response.data.results }));
		callback({ status: request.SUCCESS, products: response.data.results });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* createProduct({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.createProduct, data);

		yield put(actions.save({ type: types.CREATE_PRODUCT, product: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* editProduct({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.editProduct, data);

		yield put(actions.save({ type: types.EDIT_PRODUCT, product: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* removeProduct({ payload }: any) {
	const { callback, id } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(service.removeProduct, id);

		yield put(actions.save({ type: types.REMOVE_PRODUCT, id }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getProductsWatcherSaga = function* getProductsWatcherSaga() {
	yield takeLatest(types.GET_PRODUCTS, getProducts);
};

const createProductWatcherSaga = function* createProductWatcherSaga() {
	yield takeLatest(types.CREATE_PRODUCT, createProduct);
};

const editProductWatcherSaga = function* editProductWatcherSaga() {
	yield takeLatest(types.EDIT_PRODUCT, editProduct);
};

const removeProductWatcherSaga = function* removeProductWatcherSaga() {
	yield takeLatest(types.REMOVE_PRODUCT, removeProduct);
};

export default [
	getProductsWatcherSaga(),
	createProductWatcherSaga(),
	editProductWatcherSaga(),
	removeProductWatcherSaga(),
];
