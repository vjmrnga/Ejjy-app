import axios from 'axios';

export const service = {
	getCount: async (baseURL) =>
		axios.get('/failed-transfer-logs/count/', { baseURL }),
};
