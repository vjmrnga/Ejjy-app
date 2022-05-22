import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CashieringAssignmentsService, ONLINE_API_URL } from 'services';
import { getLocalIpAddress } from '../utils/function';

const useCashieringAssignments = ({ params }: Query) =>
	useQuery<any>(
		[
			'useCashieringAssignments',
			params?.page,
			params?.pageSize,
			params?.serverUrl,
		],
		async () =>
			CashieringAssignmentsService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					user_id: params?.userId,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
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
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
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
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
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
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useCashieringAssignments');
			},
		},
	);
};

export default useCashieringAssignments;
