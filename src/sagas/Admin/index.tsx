import siteSettingsSagas from './site-settings';
import logsSagas from './logs';

export const adminSagas = [...siteSettingsSagas, ...logsSagas];
