import axios from 'axios';

interface Edit {
	address_of_tax_payer: string;
	close_day_deadline: string;
	close_session_deadline: string;
	is_markdown_allowed_if_credit: boolean;
	is_discount_allowed_if_credit: boolean;
	permit_number: string;
	pos_accreditation_date: string;
	pos_accreditation_number: string;
	pos_accreditation_valid_until_date: string;
	product_version: string;
	proprietor: string;
	ptu_date: string;
	ptu_number: string;
	ptu_valid_until_date: string;
	reporting_period_day_of_month: string;
	reset_counter_notification_threshold_amount: number;
	reset_counter_notification_threshold_invoice_number: number;
	software_developer_tin: string;
	software_developer: string;
	store_name: string;
	tax_type: string;
	thank_you_message: string;
	tin: string;
}

const service = {
	retrieve: async (baseURL) => axios.get('/site-settings/single/', { baseURL }),

	edit: async (id: number, body: Edit, baseURL) =>
		axios.patch(`/site-settings/${id}/`, body, { baseURL }),
};

export default service;
