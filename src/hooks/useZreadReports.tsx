import { useMutation } from 'react-query';
import { ZReadReportsService } from 'services';
import { getLocalApiUrl } from 'utils';

export const useZReadReportCreate = () =>
	useMutation<any, any, any>(({ branchMachineId, userId }: any) =>
		ZReadReportsService.create(
			{
				branch_machine_id: branchMachineId,
				user_id: userId,
			},
			getLocalApiUrl(),
		),
	);
