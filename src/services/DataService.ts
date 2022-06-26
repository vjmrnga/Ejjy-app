import axios from 'axios';

interface Upload {
	is_back_office: boolean;
}

const service = {
	upload: async (body: Upload) => axios.post('/offline-upload-data/', body),
};

export default service;
