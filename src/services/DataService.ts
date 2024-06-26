import axios from 'axios';

interface Initialize {
	branch_id?: number;
	is_head_office?: boolean;
}

interface Upload {
	is_back_office: boolean;
}

const service = {
	initialize: async (params: Initialize, baseURL) =>
		axios.get('/bulk-initialize/', { baseURL, params }),

	upload: async (body: Upload, baseURL) =>
		axios.post('/offline-upload-data/', body, { baseURL }),
};

export default service;
