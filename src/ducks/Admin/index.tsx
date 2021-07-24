import failedTransfersReducer, {
	key as FAILED_TRANSFERS_KEY,
} from './failed-transfers';

export const adminReducers = {
	[FAILED_TRANSFERS_KEY]: failedTransfersReducer,
};
