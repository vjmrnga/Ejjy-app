import axios from 'axios';

interface Create {
	user_id: number;
}

const service = {
	create: async (body: Create, baseURL) =>
		axios.post('/zread-reports/', body, { baseURL }),
};

export default service;
