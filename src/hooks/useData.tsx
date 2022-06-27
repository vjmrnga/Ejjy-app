import { getBaseURL } from 'hooks/helper';
import { useQuery } from 'react-query';
import { DataService } from 'services';

const REFETCH_INTERVAL_MS = 60000;

export const useUploadData = () =>
	useQuery(
		['useUploadData'],
		() =>
			DataService.upload(
				{
					is_back_office: true,
				},
				getBaseURL(),
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
			DataService.initialize(getBaseURL()).catch((e) =>
				Promise.reject(e.errors),
			),
		{
			refetchInterval: REFETCH_INTERVAL_MS,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: [],
		},
	);
