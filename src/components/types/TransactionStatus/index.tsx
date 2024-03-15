import { Tag } from 'antd';
import { EMPTY_CELL, transactionStatuses } from 'global';
import React from 'react';

export const TransactionStatus = ({ status }) => {
	switch (status) {
		case transactionStatuses.NEW: {
			return <Tag color="yellow">New</Tag>;
		}
		case transactionStatuses.FULLY_PAID: {
			return <Tag color="green">Fully Paid</Tag>;
		}
		case transactionStatuses.HOLD: {
			return <Tag color="yellow">Hold</Tag>;
		}
		case transactionStatuses.VOID_CANCELLED: {
			return <Tag color="red">Cancelled</Tag>;
		}
		case transactionStatuses.VOID_EDITED: {
			return <Tag color="blue">Edited</Tag>;
		}
		default: {
			return <>{EMPTY_CELL}</>;
		}
	}

	return null;
};
