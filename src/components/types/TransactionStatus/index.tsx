import { BadgePill } from 'components/elements';
import { EMPTY_CELL, transactionStatuses } from 'global';
import React from 'react';

export const TransactionStatus = ({ status }) => {
	let component = null;

	switch (status) {
		case transactionStatuses.NEW: {
			component = <BadgePill label="New" variant="secondary" />;
			break;
		}
		case transactionStatuses.FULLY_PAID: {
			component = <BadgePill label="Fully Paid" variant="primary" />;
			break;
		}
		case transactionStatuses.HOLD: {
			component = <BadgePill label="Hold" variant="secondary" />;
			break;
		}
		case transactionStatuses.VOID_CANCELLED: {
			component = <BadgePill label="Cancelled" />;
			break;
		}
		case transactionStatuses.VOID_EDITED: {
			component = <BadgePill label="Edited" />;
			break;
		}
		default: {
			component = EMPTY_CELL;
		}
	}

	return component;
};
