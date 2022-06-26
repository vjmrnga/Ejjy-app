import { IS_APP_LIVE } from 'global';
import { useMutation, useQueryClient } from 'react-query';
import { BranchAssignmentsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

export const useBranchAssignmentCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(({ branchId, userId }: any) =>
		BranchAssignmentsService.create(
			{
				branch_id: branchId,
				user_id: userId,
			},
			IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
		),
	);
};
