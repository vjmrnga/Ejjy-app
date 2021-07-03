import failedTransfersReducer, {
	key as FAILED_TRANSFERS_KEY,
} from './failed-transfers';
import siteSettingsReducer, { key as SITE_SETTINGS_KEY } from './site-settings';

export const adminReducers = {
	[SITE_SETTINGS_KEY]: siteSettingsReducer,
	[FAILED_TRANSFERS_KEY]: failedTransfersReducer,
};
