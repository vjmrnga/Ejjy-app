export const ONLINE_API_URL = process.env.REACT_APP_ONLINE_API_URL;

export const API_TIMEOUT = 0;

export const NO_VERIFICATION_NEEDED = 'NO_VERIFICATION_NEEDED';

export const NO_VERIFICATION_CONFIG = { params: NO_VERIFICATION_NEEDED };

export { default as AccountsService } from './AccountsService';
export { default as BackOrdersService } from './BackOrdersService';
export { default as BranchesDayService } from './BranchesDayService';
export { default as CollectionReceiptsService } from './CollectionReceiptsService';
export { default as ConnectivityLogsService } from './ConnectivityLogsService';
export { default as CreditRegistrationsService } from './CreditRegistrationsService';
export { default as OrderOfPaymentsService } from './OrderOfPaymentsService';
export { default as SalesTrackerService } from './SalesTrackerService';
export { default as TransactionProductsService } from './TransactionProductsService';
export { default as TransactionsService } from './TransactionsService';
export { default as UsersService } from './UsersService';
