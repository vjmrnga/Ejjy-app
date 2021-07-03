import { call, put, select, takeLatest } from 'redux-saga/effects';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { actions, types } from '../ducks/order-slip-creation';
import { MAX_PAGE_SIZE } from '../global/constants';
import { request } from '../global/types';
import { ONLINE_API_URL } from '../services';
import { service as branchProductsService } from '../services/branch-products';
import { service as usersService } from '../services/OfficeManager/users';
import { getLocalIpAddress } from '../utils/function';

/* WORKERS */
function* listBranchProducts({ payload }: any) {
	const { branchId, search, productIds, callback } = payload;
	callback({ status: request.REQUESTING });

	const localURL = getLocalIpAddress();

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	try {
		const response = yield call(
			branchProductsService.list,
			{
				page: 1,
				page_size: MAX_PAGE_SIZE,
				search,
				product_ids: productIds,
			},
			baseURL || localURL,
		);
		yield put(
			actions.save({
				type: types.GET_BRANCH_PRODUCTS,
				branchId,
				branchProducts: response.data.results,
			}),
		);

		callback({ status: request.SUCCESS, response: response.data.results });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* listUsers({ payload }: any) {
	const { branchId, userType, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(
			usersService.listOnline,
			{
				page: 1,
				page_size: MAX_PAGE_SIZE,
				branch_id: branchId,
				user_type: userType,
			},
			ONLINE_API_URL,
		);

		yield put(
			actions.save({
				type: types.GET_USERS,
				branchId,
				users: response.data.results,
			}),
		);
		callback({ status: request.SUCCESS, response: response.data.results });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors, response: e.response });
	}
}

/* WATCHERS */
const listBranchProductsWatcherSaga =
	function* listBranchProductsWatcherSaga() {
		yield takeLatest(types.GET_BRANCH_PRODUCTS, listBranchProducts);
	};

const listUsersWatcherSaga = function* listUsersWatcherSaga() {
	yield takeLatest(types.GET_USERS, listUsers);
};

export default [listBranchProductsWatcherSaga(), listUsersWatcherSaga()];
