import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../../ducks/OfficeManager/branch-machines';
import { selectors as branchesSelectors } from '../../ducks/OfficeManager/branches';
import { MAX_PAGE_SIZE } from '../../global/constants';
import { request } from '../../global/types';
import { service } from '../../services/OfficeManager/branch-machines';
import { getLocalIpAddress } from '../../utils/function';

/* WORKERS */
function* list({ payload }: any) {
	const { branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	const localURL = getLocalIpAddress();

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	const data = {
		page: 1,
		page_size: MAX_PAGE_SIZE,
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

function* retrieveSales({ payload }: any) {
	const { branchId, timeRange, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	const data = {
		page: 1,
		page_size: MAX_PAGE_SIZE,
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
						page_size: MAX_PAGE_SIZE,
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

	const localURL = getLocalIpAddress();

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	try {
		const response = yield call(service.create, data, baseURL || localURL);

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

	const localURL = getLocalIpAddress();

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	try {
		const response = yield call(service.edit, id, data, baseURL || localURL);

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

const retrieveSalesWatcherSaga = function* retrieveSalesWatcherSaga() {
	yield takeLatest(types.RETRIEVE_BRANCH_MACHINE_SALES, retrieveSales);
};

const retrieveSalesAllWatcherSaga = function* retrieveSalesAllWatcherSaga() {
	yield takeLatest(types.RETRIEVE_BRANCH_MACHINE_SALES_ALL, retrieveSalesAll);
};

const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE_BRANCH_MACHINE, create);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT_BRANCH_MACHINE, edit);
};

export default [
	listWatcherSaga(),
	retrieveSalesWatcherSaga(),
	retrieveSalesAllWatcherSaga(),
	createWatcherSaga(),
	editWatcherSaga(),
];
