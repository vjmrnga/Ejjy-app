export const ONLINE_API_URL = process.env.REACT_APP_ONLINE_API_URL;

export const API_TIMEOUT = 0;

export const NO_VERIFICATION_NEEDED = 'NO_VERIFICATION_NEEDED';

export const NO_VERIFICATION_CONFIG = { params: NO_VERIFICATION_NEEDED };

export { default as AccountsService } from './AccountsService';
export { default as BackOrdersService } from './BackOrdersService';
export { default as BalanceAdjustmentLogService } from './BalanceAdjustmentLogService';
export { default as BirReportsService } from './BirReportsService';
export { default as BranchesDayService } from './BranchesDayService';
export { default as BranchMachinesService } from './BranchMachinesService';
export { default as BranchProductsService } from './BranchProductsService';
export { default as CollectionReceiptsService } from './CollectionReceiptsService';
export { default as ConnectivityLogsService } from './ConnectivityLogsService';
export { default as CreditRegistrationsService } from './CreditRegistrationsService';
export { default as DiscountOptionsService } from './DiscountOptionsService';
export { default as OrderOfPaymentsService } from './OrderOfPaymentsService';
export { default as PointSystemTagsService } from './PointSystemTagsService';
export { default as PriceMarkdownsService } from './PriceMarkdownsService';
export { default as ProductsService } from './ProductsService';
export { default as ReceivingVouchersService } from './ReceivingVouchersService';
export { default as SalesTrackerService } from './SalesTrackerService';
export { default as SiteSettingsService } from './SiteSettingsService';
export { default as TransactionProductsService } from './TransactionProductsService';
export { default as TransactionsService } from './TransactionsService';
export { default as UsersService } from './UsersService';
export { default as XReadReportsService } from './XReadReportsService';
export { default as ZReadReportsService } from './ZReadReportsService';
