import siteSettingsReducer, { key as SITE_SETTINGS_KEY } from './site-settings';

export const adminReducers = {
	[SITE_SETTINGS_KEY]: siteSettingsReducer,
};
