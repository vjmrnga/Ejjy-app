import { message } from 'antd';
import { memoize } from 'lodash';
import moment from 'moment';
import React from 'react';
import {
	AvailableBadgePill,
	FDS1CreatedBadgePill,
	FDS1DoneBadgePill,
	FDS1ErrorBadgePill,
	FOS1CreatedBadgePill,
	FOS1PreparedBadgePill,
	NewBadgePill,
	OutOfStocksBadgePill,
	ReorderBadgePill,
	ROW_HEIGHT,
	SeenBadgePill,
} from '../components';
import { branchProductStatus, purchaseRequestActions, request } from '../global/variables';

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

export const modifiedCallback = (callback, successMessage, errorMessage) => {
	return (response) => {
		showMessage(response?.status, successMessage, errorMessage);
		callback(response);
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
