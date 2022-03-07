export const ONLINE_API_URL = process.env.REACT_APP_ONLINE_API_URL;

export const API_TIMEOUT = 0;

export const NO_VERIFICATION_NEEDED = 'NO_VERIFICATION_NEEDED';

export const NO_VERIFICATION_CONFIG = { params: NO_VERIFICATION_NEEDED };

export { default as AccountsService } from './AccountsService';
export { default as BranchesDayService } from './BranchesDayService';
export { default as ConnectivityLogsService } from './ConnectivityLogsService';
export { default as CreditRegistrationsService } from './CreditRegistrationsService';
