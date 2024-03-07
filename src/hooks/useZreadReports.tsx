import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { ZReadReportsService } from 'services';

const MACHINE_SERVER_URL = 'http://localhost:8005/v1';

const useZReadReports = ({ params }: Query) =>
	useQuery<any>(
		[
			'useZReadReports',
			params?.branchMachineId,
			params?.branchMachineName,
			params?.page,
			params?.pageSize,
			params?.timeRange,
		],
		() =>
			wrapServiceWithCatch(
				ZReadReportsService.list(
					{
						branch_machine_name: params?.branchMachineName,
						branch_machine_id: params?.branchMachineId,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						time_range: params?.timeRange,
					},
					MACHINE_SERVER_URL,
					// getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				zReadReports: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useZReadReports;
