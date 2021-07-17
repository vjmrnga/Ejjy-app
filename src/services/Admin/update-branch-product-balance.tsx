import axios from 'axios';

export const service = {
	getCount: async (baseURL) =>
		axios.get('update-branch-product-balance-logs/count/', { baseURL }),
};
