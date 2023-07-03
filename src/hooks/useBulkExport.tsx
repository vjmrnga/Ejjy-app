import { createXReadTxt, createZReadTxt } from 'configureTxt';
import { DEFAULT_PAGE, MAX_PAGE_SIZE } from 'global';
import { useMutation } from 'react-query';
import {
	BulkExportService,
	XReadReportsService,
	ZReadReportsService,
} from 'services';
import { getLocalApiUrl } from 'utils';

export const useBulkExportXReadReports = () =>
	useMutation<any, any, any>(async ({ siteSettings, timeRange, user }: any) => {
		const localApiUrl = getLocalApiUrl();

		const { data: reports } = await XReadReportsService.list(
			{
				page_size: MAX_PAGE_SIZE,
				page: DEFAULT_PAGE,
				time_range: timeRange,
				is_with_daily_sales_data: false,
			},
			getLocalApiUrl(),
		);

		const data = reports.results.map((report) => ({
			file_name: `XReadReport_${report.id}.txt`,
			contents: createXReadTxt({
				report,
				siteSettings,
				user,
				returnContent: true,
			}),
		}));

		return BulkExportService.bulkExportReports(
			{
				data,
				folder_name: 'xread',
			},
			localApiUrl,
		);
	});

export const useBulkExportZReadReports = () =>
	useMutation<any, any, any>(async ({ siteSettings, timeRange, user }: any) => {
		const localApiUrl = getLocalApiUrl();

		const { data: reports } = await ZReadReportsService.list(
			{
				page_size: MAX_PAGE_SIZE,
				page: DEFAULT_PAGE,
				time_range: timeRange,
			},
			getLocalApiUrl(),
		);

		const data = reports.results.map((report) => ({
			file_name: `ZReadReport_${report.id}.txt`,
			contents: createZReadTxt({
				report,
				siteSettings,
				user,
				returnContent: true,
			}),
		}));

		return BulkExportService.bulkExportReports(
			{
				data,
				folder_name: 'zread',
			},
			localApiUrl,
		);
	});
