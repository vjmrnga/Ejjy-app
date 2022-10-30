import { useMutation } from 'react-query';
import { XReadReportsService } from 'services';
import { getLocalApiUrl } from 'utils';

export const useXReadReportCreate = () =>
	useMutation(({ branchMachineId, date, cashieringSessionId, userId }: any) =>
		XReadReportsService.create(
			{
				branch_machine_id: branchMachineId,
				cashiering_session_id: cashieringSessionId,
				date,
				user_id: userId,
			},
			getLocalApiUrl(),
		),
	);
