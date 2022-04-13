import { IS_APP_LIVE } from 'global';
import { useMutation } from 'react-query';
import { ONLINE_API_URL, ZReadReportsService } from 'services';
import { getLocalIpAddress } from 'utils/function';

export const useZReadReportCreate = () =>
	useMutation(({ serverUrl, userId }: any) => {
		let baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
		if (serverUrl) {
			baseURL = serverUrl;
		}

		return ZReadReportsService.create(
			{
				user_id: userId,
			},
			baseURL,
		);
	});
