import { message } from 'antd';
import { floor, memoize } from 'lodash';
import moment from 'moment';
import React from 'react';
import {
	AddedToOSBadgePill,
	AvailableBadgePill,
	FDS1CreatedBadgePill,
	FDS1DoneBadgePill,
	FDS1ErrorBadgePill,
	FOS1CreatedBadgePill,
	FOS1PreparedBadgePill,
	NewBadgePill,
	NotAddedToOSBadgePill,
	OutOfStocksBadgePill,
	ReorderBadgePill,
	ROW_HEIGHT,
	SeenBadgePill,
} from '../components';
import { BadgePill } from '../components/elements';
import {
	branchProductStatus,
	orderSlipStatus,
	purchaseRequestActions,
	purchaseRequestProductStatus,
	request,
	userTypes,
} from '../global/types';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const calculateTableHeight = (listLength) => {
	const MAX_ROW_COUNT = 6;
	return ROW_HEIGHT * (listLength <= MAX_ROW_COUNT ? listLength : MAX_ROW_COUNT);
};

export const showMessage = (status, successMessage, errorMessage) => {
	if (status === request.SUCCESS) {
		message.success(successMessage);
	} else if (status === request.ERROR) {
		message.error(errorMessage);
	}
};

export const formatDateTime = (datetime) => moment(datetime).format('MM/DD/YYYY h:mma ');

export const convertToBulk = (pieces, piecesInBulk) => floor(pieces / piecesInBulk);

export const convertToPieces = (bulk, piecesInBulk) => bulk * piecesInBulk;

export const modifiedCallback = (callback, successMessage, errorMessage, extraCallback = null) => {
	return (response) => {
		showMessage(response?.status, successMessage, errorMessage);
		callback(response);
		if (extraCallback) {
			extraCallback(response);
		}
	};
};

export const modifiedExtraCallback = (callback, extraCallback = null) => {
	return (response) => {
		callback(response);
		if (extraCallback) {
			extraCallback(response);
		}
	};
};

export const getBranchProductStatus = memoize((status) => {
	switch (status) {
		case branchProductStatus.AVAILABLE: {
			return <AvailableBadgePill />;
		}
		case branchProductStatus.REORDER: {
			return <ReorderBadgePill />;
		}
		case branchProductStatus.OUT_OF_STOCK: {
			return <OutOfStocksBadgePill />;
		}
	}
});

export const getPurchaseRequestStatus = memoize((status) => {
	switch (status) {
		case purchaseRequestActions.NEW: {
			return <NewBadgePill />;
		}
		case purchaseRequestActions.SEEN: {
			return <SeenBadgePill />;
		}
		case purchaseRequestActions.F_OS1_CREATED: {
			return <FOS1CreatedBadgePill />;
		}
		case purchaseRequestActions.F_OS1_PREPARED: {
			return <FOS1PreparedBadgePill />;
		}
		case purchaseRequestActions.F_DS1_CREATED: {
			return <FDS1CreatedBadgePill />;
		}
		case purchaseRequestActions.F_DS1_DONE: {
			return <FDS1DoneBadgePill />;
		}
		case purchaseRequestActions.F_DS1_ERROR: {
			return <FDS1ErrorBadgePill />;
		}
	}
});

export const getPurchaseRequestProductStatus = memoize((status) => {
	switch (status) {
		case purchaseRequestProductStatus.ADDED_TO_OS: {
			return <AddedToOSBadgePill />;
		}
		case purchaseRequestProductStatus.NOT_ADDED_TO_OS: {
			return <NotAddedToOSBadgePill />;
		}
	}
});

export const getOrderSlipStatus = memoize((status, percentage, isDrStatusError = false) => {
	switch (status) {
		case orderSlipStatus.PREPARING: {
			return <BadgePill label={`Preparing (${percentage}%)`} />;
		}
		case orderSlipStatus.PREPARED: {
			return <BadgePill label="Prepared" variant="secondary" />;
		}
		case orderSlipStatus.DELIVERED: {
			return <BadgePill label="Delivered" variant={isDrStatusError ? 'error' : 'primary'} />;
		}
	}
});

export const getUserTypeName = memoize((type) => {
	switch (type) {
		case userTypes.OFFICE_MANAGER: {
			return 'Office Manager';
		}
		case userTypes.BRANCH_MANAGER: {
			return 'Branch Manager';
		}
		case userTypes.BRANCH_PERSONNEL: {
			return 'Branch Personnel';
		}
	}
});
