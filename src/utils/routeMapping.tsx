import { userTypes } from '../global/variables';
import {
	BranchManagerDashboard,
	BranchManagerNotifications,
	BranchManagerOrderSlips,
	BranchManagerProducts,
	BranchManagerPurchaseRequests,
	BranchManagerViewPurchaseRequest,
	OfficeManagerBranches,
	OfficeManagerDashboard,
	OfficeManagerNotifications,
	OfficeManagerProducts,
	OfficeManagerPurchaseRequests,
	OfficeManagerUsers,
	OfficeManagerViewBranch,
} from '../screens';

export const DashboardScreens = {
	[userTypes.OFFICE_MANAGER]: OfficeManagerDashboard,
	[userTypes.BRANCH_MANAGER]: BranchManagerDashboard,
};

export const ProductsScreens = {
	[userTypes.OFFICE_MANAGER]: OfficeManagerProducts,
	[userTypes.BRANCH_MANAGER]: BranchManagerProducts,
};

export const BranchesScreens = {
	[userTypes.OFFICE_MANAGER]: OfficeManagerBranches,
};

export const ViewBranchScreens = {
	[userTypes.OFFICE_MANAGER]: OfficeManagerViewBranch,
};

export const PurchaseRequestsScreens = {
	[userTypes.OFFICE_MANAGER]: OfficeManagerPurchaseRequests,
	[userTypes.BRANCH_MANAGER]: BranchManagerPurchaseRequests,
};

export const ViewPurchaseRequestScreens = {
	[userTypes.BRANCH_MANAGER]: BranchManagerViewPurchaseRequest,
};

export const OrderSlipsScreens = {
	[userTypes.BRANCH_MANAGER]: BranchManagerOrderSlips,
};

export const UsersScreens = {
	[userTypes.OFFICE_MANAGER]: OfficeManagerUsers,
};

export const NotificationsScreens = {
	[userTypes.OFFICE_MANAGER]: OfficeManagerNotifications,
	[userTypes.BRANCH_MANAGER]: BranchManagerNotifications,
};
