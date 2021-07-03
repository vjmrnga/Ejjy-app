import axios from 'axios';

export const service = {
	getById: async (id: number, baseURL) =>
		axios.get(`/delivery-receipt-products/${id}/with-adjustment-slips/`, {
			baseURL,
		}),
};
