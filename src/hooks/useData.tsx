import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { DataService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl, isStandAlone } from 'utils';

const REFETCH_INTERVAL_MS = 60000;

export const useInitializeData = ({ params }: Query) =>
	useQuery(
		['useInitializeData', params?.branchId],
		() =>
			DataService.initialize(
				{ branch_id: params.branchId },
				getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			enabled: !!getOnlineApiUrl() && !!params?.branchId,
			refetchInterval: REFETCH_INTERVAL_MS,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: ['isLoading'],
		},
	);

export const useUploadData = () =>
	useQuery(
		['useUploadData'],
		() =>
			DataService.upload(
				{
					is_back_office: true,
				},
				getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			enabled: !isStandAlone(),
			refetchInterval: REFETCH_INTERVAL_MS,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: ['isLoading'],
		},
	);
