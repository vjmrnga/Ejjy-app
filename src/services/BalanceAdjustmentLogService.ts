import axios from 'axios';

interface Create {
	branch_product_id: number;
	creating_user_id: number;
	new_balance: number;
}

const service = {
	create: async (body: Create, baseURL) =>
		axios.post('/balance-adjustment-logs/', body, { baseURL }),
};

export default service;
