import axios from 'axios';

interface IEditSiteSettings {
	close_day_deadline: string;
	close_session_deadline: string;
}

export const service = {
	get: async () => axios.get('/site-settings/single/'),
	edit: async (id: number, body: IEditSiteSettings) => axios.patch(`/site-settings/${id}/`, body),
};
