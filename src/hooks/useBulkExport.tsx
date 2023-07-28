import { createXReadTxt, createZReadTxt } from 'configureTxt';
import dayjs from 'dayjs';
import { DEFAULT_PAGE, MAX_PAGE_SIZE } from 'global';
import { useMutation } from 'react-query';
import {
	BulkExportService,
	XReadReportsService,
	ZReadReportsService,
} from 'services';
import { getLocalApiUrl } from 'utils';

export const useBulkExport = () =>
	useMutation<any, any, any>(async ({ siteSettings, timeRange, user }: any) => {
		const localApiUrl = getLocalApiUrl();

		const params = {
			page_size: MAX_PAGE_SIZE,
			page: DEFAULT_PAGE,
			time_range: timeRange,
		};

		const [xreadReports, zreadReports] = await Promise.all<any>([
			XReadReportsService.list(
				{
					...params,
					is_with_daily_sales_data: false,
				},
				localApiUrl,
			),
			ZReadReportsService.list(params, localApiUrl),
		]);

		const requests = [];

		if (xreadReports.data.results.length > 0) {
			requests.push(
				BulkExportService.bulkExportReports(
					{
						data: xreadReports.data.results.map((report) => ({
							folder_name: 'reports/xread',
							file_name: `XReadReport_${dayjs(report.datetime_created).format(
								'MMDDYY',
							)}_${report.id}.txt`,
							contents: createXReadTxt({
								report,
								siteSettings,
								user,
								returnContent: true,
							}),
						})),
					},
					localApiUrl,
				),
			);
		}

		if (zreadReports.data.results.length > 0) {
			requests.push(
				BulkExportService.bulkExportReports(
					{
						data: zreadReports.data.results.map((report) => ({
							folder_name: 'reports/zread',
							file_name: `ZReadReport_${dayjs(report.datetime_created).format(
								'MMDDYY',
							)}_${report.id}.txt`,
							contents: createZReadTxt({
								report,
								siteSettings,
								user,
								returnContent: true,
							}),
						})),
					},
					localApiUrl,
				),
			);
		}

		return Promise.all(requests);
	});
