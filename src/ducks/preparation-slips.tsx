import { createAction } from 'redux-actions';

export const key = 'PREPARATION_SLIPS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_PREPARATION_SLIPS: `${key}/GET_PREPARATION_SLIPS`,
	GET_PREPARATION_SLIP_BY_ID: `${key}/GET_PREPARATION_SLIP_BY_ID`,
	FULFILL_PREPARATION_SLIP: `${key}/FULFILL_PREPARATION_SLIP`,
	APPROVE_OR_DISAPPROVE_PREPARATION_SLIP: `${key}/APPROVE_OR_DISAPPROVE`,
};

export const actions = {
	save: createAction(types.SAVE),
	getPreparationSlips: createAction(types.GET_PREPARATION_SLIPS),
	getPreparationSlipById: createAction(types.GET_PREPARATION_SLIP_BY_ID),
	fulfillPreparationSlip: createAction(types.FULFILL_PREPARATION_SLIP),
	approveOrDisapprovePreparationSlip: createAction(
		types.APPROVE_OR_DISAPPROVE_PREPARATION_SLIP,
	),
};
