import axios from 'axios';

export const service = {
	listLogs: async (params, baseURL) =>
		axios.get('/action-logs/', { baseURL, params }),

	getCount: async (baseURL) => axios.get('/action-logs/count/', { baseURL }),
};
