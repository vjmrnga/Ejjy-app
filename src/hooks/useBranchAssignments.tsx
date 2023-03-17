import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { BranchAssignmentsService } from 'services';
import { getGoogleApiUrl, getLocalApiUrl } from 'utils';

const useBranchAssignments = ({ params, shouldFetchOfflineFirst }: Query) =>
	useQuery<any>(
		[
			'useBranchAssignments',
			params?.branchId,
			params?.page,
			params?.pageSize,
			params?.timeRange,
			params?.userId,
			shouldFetchOfflineFirst,
		],
		async () => {
			const baseURL = getLocalApiUrl();

			if (shouldFetchOfflineFirst) {
				await BranchAssignmentsService.listOffline(baseURL);
			}

			return wrapServiceWithCatch(
				BranchAssignmentsService.list(
					{
						branch_id: params?.branchId,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						time_range: params?.timeRange,
						user_id: params?.userId,
					},
					baseURL,
				),
			);
		},
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				branchAssignments: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useBranchAssignmentCreate = () =>
	useMutation<any, any, any>(({ branchId, userId }: any) =>
		BranchAssignmentsService.create(
			{
				branch_id: branchId,
				user_id: userId,
			},
			getGoogleApiUrl(),
		),
	);

export default useBranchAssignments;
