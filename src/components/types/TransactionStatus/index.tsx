import { BadgePill } from 'components/elements';
import { EMPTY_CELL, transactionStatus } from 'global';
import React from 'react';

export const TransactionStatus = ({ status }) => {
	let component = null;

	switch (status) {
		case transactionStatus.NEW: {
			component = <BadgePill label="New" variant="secondary" />;
			break;
		}
		case transactionStatus.FULLY_PAID: {
			component = <BadgePill label="Fully Paid" variant="primary" />;
			break;
		}
		case transactionStatus.HOLD: {
			component = <BadgePill label="Hold" variant="secondary" />;
			break;
		}
		case transactionStatus.VOID_CANCELLED: {
			component = <BadgePill label="Cancelled" />;
			break;
		}
		case transactionStatus.VOID_EDITED: {
			component = <BadgePill label="Edited" />;
			break;
		}
		default: {
			component = EMPTY_CELL;
		}
	}

	return component;
};
