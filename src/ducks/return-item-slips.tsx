import { createAction } from 'redux-actions';

export const key = 'RETURN_ITEM_SLIPS';

export const types = {
	GET_RETURN_ITEM_SLIPS: `${key}/GET_RETURN_ITEM_SLIPS`,
	CREATE_RETURN_ITEM_SLIP: `${key}/CREATE_RETURN_ITEM_SLIP`,
	EDIT_RETURN_ITEM_SLIP: `${key}/EDIT_RETURN_ITEM_SLIP`,
	RECEIVE_RETURN_ITEM_SLIP: `${key}/RECEIVE_RETURN_ITEM_SLIP`,
};

export const actions = {
	getReturnItemSlips: createAction(types.GET_RETURN_ITEM_SLIPS),
	createReturnItemSlip: createAction(types.CREATE_RETURN_ITEM_SLIP),
	editReturnItemSlip: createAction(types.EDIT_RETURN_ITEM_SLIP),
	receiveReturnItemSlip: createAction(types.RECEIVE_RETURN_ITEM_SLIP),
};
