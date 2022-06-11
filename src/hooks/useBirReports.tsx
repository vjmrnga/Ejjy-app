import { selectors as branchesSelectors } from 'ducks/OfficeManager/branches';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global/';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { BirReportsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';
import { Query } from './inteface';

const useBirReports = ({ params }: Query) => {
	let baseURL = useSelector(
		branchesSelectors.selectURLByBranchId(params?.branchId),
	);

	return useQuery<any>(
		[
			'useBirReports',
			params?.branchMachineId,
			params?.timeRange,
			params?.page,
			params?.pageSize,
		],
		async () => {
			if (!baseURL && params.branchId) {
				throw ['Branch has no online url.'];
			} else {
				baseURL = IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl();
			}

			baseURL = params.serverUrl || baseURL;

			return await BirReportsService.list(
				{
					branch_machine_id: params?.branchMachineId,
					time_range: params?.timeRange,
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				},
				baseURL,
			);
		},
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				birReports: query.data.results,
				total: query.data.count,
			}),
		},
	);
};

export default useBirReports;
