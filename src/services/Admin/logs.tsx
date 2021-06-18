import axios from 'axios';

export const service = {
	getUpdateBranchProductBalanceLogs: async (baseURL) =>
		axios.get('/update-branch-product-balance-logs/', { baseURL }),
};
