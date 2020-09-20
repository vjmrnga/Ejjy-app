import preparationReducer, { key as PREPARATION_KEY } from './preparation-slips';

export const officeManagerReducers = {
	[PREPARATION_KEY]: preparationReducer,
};
