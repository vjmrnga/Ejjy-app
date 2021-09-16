import axios from 'axios';

interface IEditSiteSettings {
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
	thank_you_message: string;
}

export const service = {
	get: async (baseURL) => axios.get('/site-settings/single/', { baseURL }),

	edit: async (id: number, body: IEditSiteSettings, baseURL) =>
		axios.patch(`/site-settings/${id}/`, body, { baseURL }),
};
