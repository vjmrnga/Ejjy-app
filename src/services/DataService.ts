import axios from 'axios';

interface Upload {
	is_back_office: boolean;
}

const service = {
	initialize: async (baseURL) => axios.get('/bulk-initialize/', { baseURL }),

	upload: async (body: Upload, baseURL) =>
		axios.post('/offline-upload-data/', body, { baseURL }),
};

export default service;
