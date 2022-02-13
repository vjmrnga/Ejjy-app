/* eslint-disable no-confusing-arrow */
import axios from 'axios';
import { IListRequest } from './interfaces';

interface ICreateProduct {
	name: string;
	machine_id: string;
	machine_printer_serial_number: string;
}

interface IEditProduct {
	machine_id: string;
	machine_printer_serial_number: string;
}

interface IRetrieveSales extends IListRequest {
	time_range: string;
}

export const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/branch-machines/', { baseURL, params }),

	getById: async (id, baseURL) =>
		axios.get(`/branch-machines/${id}/`, { baseURL }),

	retrieveSales: async (params: IRetrieveSales, baseURL, withCatch = false) =>
		withCatch
			? axios
					.get('/branch-machines/sales/', { baseURL, params })
					.catch(() => null)
			: axios.get('/branch-machines/sales/', { baseURL, params }),

	create: async (body: ICreateProduct, baseURL) =>
		axios.post('/branch-machines/', body, { baseURL }),

	edit: async (id: number, body: IEditProduct, baseURL) =>
		axios.patch(`/branch-machines/${id}/`, body, { baseURL }),
};
