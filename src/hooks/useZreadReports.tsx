import { IS_APP_LIVE } from 'global';
import { useMutation } from 'react-query';
import { ZReadReportsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

export const useZReadReportCreate = () =>
	useMutation(({ branchMachineId, serverUrl, userId }: any) => {
		let baseURL = IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl();
		if (serverUrl) {
			baseURL = serverUrl;
		}

		return ZReadReportsService.create(
			{
				branch_machine_id: branchMachineId,
				user_id: userId,
			},
			baseURL,
		);
	});
