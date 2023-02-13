import axios from 'axios';

const service = {
	test: async (baseURL) =>
		axios.get('branches/', {
			baseURL,
			params: { message: 'Testing connection between app to its server...' },
		}),
};

export default service;
