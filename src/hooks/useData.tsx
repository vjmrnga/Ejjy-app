import { useQuery } from 'react-query';
import { DataService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const REFETCH_INTERVAL_MS = 60000;

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
			refetchInterval: REFETCH_INTERVAL_MS,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: [],
		},
	);

export const useInitializeData = () =>
	useQuery(
		['useInitializeData'],
		() =>
			DataService.initialize(getLocalApiUrl()).catch((e) =>
				Promise.reject(e.errors),
			),
		{
			enabled: getOnlineApiUrl()?.length > 0,
			refetchInterval: REFETCH_INTERVAL_MS,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: ['isLoading'],
		},
	);
