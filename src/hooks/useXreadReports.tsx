import { IS_APP_LIVE } from 'global';
import { useMutation } from 'react-query';
import { XReadReportsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

export const useXReadReportCreate = () =>
	useMutation(({ branchMachineId, date, serverUrl, userId }: any) => {
		let baseURL = IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl();
		if (serverUrl) {
			baseURL = serverUrl;
		}

		return XReadReportsService.create(
			{
				branch_machine_id: branchMachineId,
				date,
				user_id: userId,
			},
			baseURL,
		);
	});
