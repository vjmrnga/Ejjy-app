import axios from 'axios';

interface Create {
	branch_product_id: string;
	type: string;
}

const service = {
	create: async (body: Create, baseURL) =>
		axios.post('/price-markdowns/', body, { baseURL }),
};
export default service;
