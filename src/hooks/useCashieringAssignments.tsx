import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CashieringAssignmentsService } from 'services';
import { getLocalApiUrl } from 'utils';

const useCashieringAssignments = ({ params }: Query) =>
	useQuery<any>(
		[
			'useCashieringAssignments',
			params?.branchId,
			params?.page,
			params?.pageSize,
			params?.timeRange,
			params?.userId,
		],
		() =>
			wrapServiceWithCatch(
				CashieringAssignmentsService.list(
					{
						branch_id: params?.branchId,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						time_range: params?.timeRange,
						user_id: params?.userId,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				cashieringAssignments: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useCashieringAssignmentCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({
			actingUserId,
			branchMachineId,
			datetimeEnd,
			datetimeStart,
			userId,
		}: any) =>
			CashieringAssignmentsService.create(
				{
					acting_user_id: actingUserId,
					branch_machine_id: branchMachineId,
					datetime_end: datetimeEnd,
					datetime_start: datetimeStart,
					user_id: userId,
				},
				getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useCashieringAssignments');
			},
		},
	);
};

export const useCashieringAssignmentEdit = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, actingUserId, datetimeStart, datetimeEnd }: any) =>
			CashieringAssignmentsService.edit(
				id,
				{
					acting_user_id: actingUserId,
					datetime_end: datetimeEnd,
					datetime_start: datetimeStart,
				},
				getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useCashieringAssignments');
			},
		},
	);
};

export const useCashieringAssignmentDelete = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, actingUserId }) =>
			CashieringAssignmentsService.delete(
				id,
				{
					acting_user_id: actingUserId,
				},
				getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useCashieringAssignments');
			},
		},
	);
};

export default useCashieringAssignments;
