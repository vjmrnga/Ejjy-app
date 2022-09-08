import axios from 'axios';

const service = {
	test: async (baseURL) => axios.get('branches/', { baseURL }),
};

export default service;
