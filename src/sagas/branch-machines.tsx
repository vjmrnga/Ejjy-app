import {
	all,
	call,
	put,
	select,
	takeEvery,
	takeLatest,
} from 'redux-saga/effects';
import { actions, types } from '../ducks/branch-machines';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { IS_APP_LIVE, MAX_PAGE_SIZE } from '../global/constants';
import { request } from '../global/types';
import { ONLINE_API_URL } from '../services';
import { service } from '../services/branch-machines';
import { getBaseUrl } from './helper';

const SALES_PAGE_SIZE = 2;

/* WORKERS */
function* list({ payload }: any) {
	const { branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = getBaseUrl(branchId, callback);

	const data = {
		page: 1,
		page_size: MAX_PAGE_SIZE,
	};

	let isFetchedFromBackupURL = false;

	try {
		let response = null;

		try {
			// Fetch in branch url
			response = yield call(service.list, data, baseURL);
		} catch (e) {
			if (ONLINE_API_URL) {
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
		}

		yield put(
			actions.save({
				type: types.GET_BRANCH_MACHINES,
				branchMachines: response.data.results,
			}),
		);
		callback({
			status: request.SUCCESS,
			warnings: isFetchedFromBackupURL
				? ['Data Source: Backup Server, data might be outdated.']
				: [],
		});
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* get({ payload }: any) {
	const { id, branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = getBaseUrl(branchId, callback);

	try {
		const response = yield call(service.getById, id, baseURL);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* retrieveSales({ payload }: any) {
	const { branchId, timeRange, callback } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = getBaseUrl(branchId, callback);

	const data = {
		page: 1,
		page_size: SALES_PAGE_SIZE,
		time_range: timeRange,
	};

	try {
		const response = yield call(service.retrieveSales, data, baseURL);
		const { results } = response.data;

		callback({
			status: request.SUCCESS,
			data: results,
		});
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* retrieveSalesAll({ payload }: any) {
	const { branchIds, timeRange, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const branchUrls = yield all(
		branchIds.map((branchId) =>
			select(branchesSelectors.selectURLByBranchId(branchId)),
		),
	);

	try {
		let responses = yield all(
			branchUrls.map((url) =>
				call(
					service.retrieveSales,
					{
						page: 1,
						page_size: SALES_PAGE_SIZE,
						time_range: timeRange,
					},
					url,
					true,
				),
			),
		);

		responses = responses
			.filter((response) => response?.status === 200)
			.map((response) => response.data.results);

		callback({ status: request.SUCCESS, data: responses });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { callback, branchId, ...data } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = getBaseUrl(branchId, callback);

	try {
		const response = yield call(service.create, data, baseURL);

		yield put(
			actions.save({
				type: types.CREATE_BRANCH_MACHINE,
				branchMachine: response.data,
			}),
		);
		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { callback, id, branchId, ...data } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = getBaseUrl(branchId, callback);

	try {
		const response = yield call(service.edit, id, data, baseURL);

		yield put(
			actions.save({
				type: types.EDIT_BRANCH_MACHINE,
				branchMachine: response.data,
			}),
		);
		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.GET_BRANCH_MACHINES, list);
};

const getWatcherSaga = function* getWatcherSaga() {
	yield takeLatest(types.GET_BRANCH_MACHINE, get);
};

const retrieveSalesWatcherSaga = function* retrieveSalesWatcherSaga() {
	yield takeEvery(types.RETRIEVE_BRANCH_MACHINE_SALES, retrieveSales);
};

const retrieveSalesAllWatcherSaga = function* retrieveSalesAllWatcherSaga() {
	yield takeEvery(types.RETRIEVE_BRANCH_MACHINE_SALES_ALL, retrieveSalesAll);
};

const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE_BRANCH_MACHINE, create);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT_BRANCH_MACHINE, edit);
};

export default [
	listWatcherSaga(),
	getWatcherSaga(),
	retrieveSalesWatcherSaga(),
	retrieveSalesAllWatcherSaga(),
	createWatcherSaga(),
	editWatcherSaga(),
];
