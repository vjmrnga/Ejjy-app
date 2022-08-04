import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BranchesDayService } from 'services';
import { getLocalApiUrl } from 'utils';

export const useBranchesDayAuthorizationsRetrieve = () => {
	return useQuery<any>(
		['useBranchesDayAuthorizationsRetrieve'],
		() =>
			BranchesDayService.retrieve(getLocalApiUrl()).catch((e) =>
				Promise.reject(e.errors),
			),
		{
			select: (query) => query?.data,
		},
	);
};

export const useBranchesDayAuthorizationCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ startedById }: any) =>
			BranchesDayService.create(
				{
					started_by_id: startedById,
				},
				getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranchesDayAuthorizationsRetrieve');
			},
		},
	);
};

export const useBranchesDayAuthorizationEnd = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, endedById }) =>
			BranchesDayService.end(
				id,
				{
					ended_by_id: endedById,
				},
				getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranchesDayAuthorizationsRetrieve');
			},
		},
	);
};
