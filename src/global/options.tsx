import { upperFirst } from 'lodash';
import { preparationSlipStatus, purchaseRequestActions, quantityTypes } from './types';

export const quantityTypeOptions = [
	{
		name: upperFirst(quantityTypes.PIECE),
		value: quantityTypes.PIECE,
	},
	{
		name: upperFirst(quantityTypes.BULK),
		value: quantityTypes.BULK,
	},
];

export const purchaseRequestActionsOptions = [
	{
		value: purchaseRequestActions.NEW,
		name: 'New',
	},
	{
		value: purchaseRequestActions.SEEN,
		name: 'Seen',
	},
	{
		value: purchaseRequestActions.F_OS1_CREATED,
		name: 'F-OS1 Created',
	},
	{
		value: purchaseRequestActions.F_OS1_PREPARED,
		name: 'F-OS1 Prepared',
	},
	{
		value: purchaseRequestActions.F_DS1_CREATED,
		name: 'F-DS1 Created',
	},
	{
		value: purchaseRequestActions.F_DS1_DONE,
		name: 'F-DS1 Done',
	},
	{
		value: purchaseRequestActions.F_DS1_ERROR,
		name: 'F-DS1 Error',
	},
];

export const purchaseRequestActionsOptionsWithAll = [
	{
		value: 'all',
		name: 'All',
	},
	...purchaseRequestActionsOptions,
];

export const preparationSlipStatusOptions = [
	{
		value: 'all',
		name: 'All',
	},
	{
		value: preparationSlipStatus.NEW,
		name: 'New',
	},
	{
		value: preparationSlipStatus.PREPARING,
		name: 'Preparing',
	},
	{
		value: preparationSlipStatus.COMPLETED,
		name: 'Completed',
	},
];
