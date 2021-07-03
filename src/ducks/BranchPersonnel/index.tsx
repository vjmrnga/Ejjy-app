import preparationReducer, {
	key as PREPARATION_KEY,
} from './preparation-slips';

export const branchPersonnelReducers = {
	[PREPARATION_KEY]: preparationReducer,
};
