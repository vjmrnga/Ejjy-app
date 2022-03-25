import axios from 'axios';

interface Edit {
	close_session_deadline: string;
	close_day_deadline: string;
	proprietor: string;
	tin: string;
	permit_number: string;
	software_developer: string;
	software_developer_tin: string;
	pos_accreditation_number: string;
	pos_accreditation_date: string;
	pos_accreditation_valid_until_date: string;
	ptu_number: string;
	ptu_date: string;
	ptu_valid_until_date: string;
	product_version: string;
	tax_type: string;
	thank_you_message: string;
	reporting_period_day_of_month: string;
	reset_counter_notification_threshold_amount: number;
	reset_counter_notification_threshold_invoice_number: number;
	store_name: string;
	address_of_tax_payer: string;
}

const service = {
	retrieve: async (baseURL) => axios.get('/site-settings/single/', { baseURL }),

	edit: async (id: number, body: Edit, baseURL) =>
		axios.patch(`/site-settings/${id}/`, body, { baseURL }),
};

export default service;
