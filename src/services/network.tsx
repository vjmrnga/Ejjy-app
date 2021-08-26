import axios from 'axios';

export const service = {
	test: async (baseURL) => axios.get('branches/', { baseURL }),
};
