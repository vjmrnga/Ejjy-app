import failedTransfersSagas from './failed-transfers';
import logsSagas from './logs';
import siteSettingsSagas from './site-settings';

export const adminSagas = [...logsSagas, ...failedTransfersSagas, ...siteSettingsSagas];
