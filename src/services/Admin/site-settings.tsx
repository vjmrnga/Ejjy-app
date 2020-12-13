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
}

export const service = {
	get: async () => axios.get('/site-settings/single/'),
	edit: async (id: number, body: IEditSiteSettings) => axios.patch(`/site-settings/${id}/`, body),
};
