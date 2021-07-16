/* eslint-disable no-confusing-arrow */
import axios from 'axios';
import { IGetRequest } from '../interfaces';

interface ICreateProduct {
	name: string;
	machine_id: string;
	machine_printer_serial_number: string;
}

interface IEditProduct {
	machine_id: string;
	machine_printer_serial_number: string;
}

interface IRetrieveSales extends IGetRequest {
	time_range: string;
}

export const service = {
	list: async (params: IGetRequest, baseURL) =>
		axios.get('/branches-machines/', { baseURL, params }),

	retrieveSales: async (params: IRetrieveSales, baseURL, withCatch = false) =>
		withCatch
			? axios
					.get('/branches-machines/sales/', { baseURL, params })
					.catch(() => null)
			: axios.get('/branches-machines/sales/', { baseURL, params }),

	create: async (body: ICreateProduct, baseURL) =>
		axios.post('/branches-machines/', body, { baseURL }),

	edit: async (id: number, body: IEditProduct, baseURL) =>
		axios.patch(`/branches-machines/${id}/`, body, { baseURL }),
};
