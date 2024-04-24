import { Col, message, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import { PdfButtons } from 'components/Printing';
import {
	BirReportsService,
	GENERIC_ERROR_MESSAGE,
	MAX_PAGE_SIZE,
	NO_TRANSACTION_REMARK,
	printBirReport,
	useBirReports,
} from 'ejjy-global';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
	refetchOptions,
	timeRangeTypes,
} from 'global';
import { usePdf, useQueryParams, useSiteSettings } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import {
	convertIntoArray,
	formatDate,
	formatInPeso,
	getLocalApiUrl,
} from 'utils';
import { tabs } from './data';

interface Props {
	branchMachineId: number;
}

const columns: ColumnsType = [
	{ title: 'Date', dataIndex: 'date', fixed: 'left' },
	{ title: 'Beginning SI/OR No.', dataIndex: 'beginningOrNumber' },
	{ title: 'Ending SI/OR No.', dataIndex: 'endingOrNumber' },
	{
		title: 'Grand Accum. Sales Ending Balance',
		dataIndex: 'grandAccumulatedSalesEndingBalance',
	},
	{
		title: 'Grand Accum. Sales Beg. Balance',
		dataIndex: 'grandAccumulatedSalesBeginningBalance',
	},
	{
		title: 'Sales Issued w/ Manual SI/OR (per RR 16-2018)',
		dataIndex: 'salesIssueWithManual',
	},
	{ title: 'Gross Sales for the Day', dataIndex: 'grossSalesForTheDay' },
	{ title: 'VATable Sales', dataIndex: 'vatableSales' },
	{ title: 'VAT Amount', dataIndex: 'vatAmount' },
	{ title: 'VAT-Exempt Sales', dataIndex: 'vatExemptSales' },
	{ title: 'Zero Rated Sales', dataIndex: 'zeroRatedSales' },
	{
		title: 'Deductions',
		children: [
			{
				title: 'Discount',
				children: [
					{ title: 'SC', dataIndex: 'scDiscount' },
					{ title: 'PWD', dataIndex: 'pwdDiscount' },
					{ title: 'NAAC', dataIndex: 'naacDiscount' },
					{ title: 'Solo Parent', dataIndex: 'spDiscount' },
					{ title: 'Others', dataIndex: 'othersDiscount' },
				],
			},
			{ title: 'Returns', dataIndex: 'returns' },
			{ title: 'Void', dataIndex: 'void' },
			{ title: 'Total Deductions', dataIndex: 'totalDeductions' },
		],
	},
	{
		title: 'Adjustment on VAT',
		children: [
			{
				title: 'Discount',
				children: [
					{ title: 'SC', dataIndex: 'vatScDiscount' },
					{ title: 'PWD', dataIndex: 'vatPwdDiscount' },
					{ title: 'Others', dataIndex: 'vatOthersDiscount' },
				],
			},
			{ title: 'VAT on Returns', dataIndex: 'vatOnReturns' },
			{ title: 'Others', dataIndex: 'vatOthers' },
			{ title: 'Total VAT Adjustment', dataIndex: 'totalVatAdjusted' },
		],
	},
	{ title: 'VAT Payable', dataIndex: 'vatPayable' },
	{
		title: 'Net Sales',
		dataIndex: 'netSales',
	},
	{ title: 'Sales Overrun/Overflow', dataIndex: 'salesOverrunOrOverflow' },
	{ title: 'Total Income', dataIndex: 'totalIncome' },
	{ title: 'Reset Counter', dataIndex: 'resetCounter' },
	{ title: 'Z-Counter', dataIndex: 'zCounter' },
	{ title: 'Remarks', dataIndex: 'remarks' },
];

export const AnnexBirSalesSummaryTab = ({ branchMachineId }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const { params, setQueryParams } = useQueryParams();
	const {
		data: siteSettings,
		isFetching: isFetchingSiteSettings,
		error: siteSettingsError,
	} = useSiteSettings();
	const {
		data: birReportsData,
		isFetching: isFetchingBirReports,
		isFetched: isBirReportsFetched,
		error: birReportsError,
	} = useBirReports({
		params: {
			branchMachineId,
			timeRange: timeRangeTypes.DAILY,
			...params,
		},
		options: refetchOptions,
		serviceOptions: { baseURL: getLocalApiUrl() },
	});
	const { htmlPdf, isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		title: `BIR_Reports.pdf`,
		jsPdfSettings: {
			orientation: 'l',
			unit: 'px',
			format: [2000, 840],
			putOnlyUsedFonts: true,
		},
		print: async () => {
			const response = await BirReportsService.list({
				branch_machine_id: branchMachineId,
				page_size: MAX_PAGE_SIZE,
				page: DEFAULT_PAGE,
				time_range: params?.timeRange as string,
			});

			const birReports = response.results;

			if (!birReports.length) {
				message.error(GENERIC_ERROR_MESSAGE);
				return undefined;
			}

			return printBirReport(birReportsData.list, siteSettings, user);
		},
	});

	// METHODS
	useEffect(() => {
		if (birReportsData?.list) {
			const data = birReportsData.list.map((report) => ({
				key: report.id,
				date: formatDate(report.date),
				beginningOrNumber: report?.beginning_or?.or_number || EMPTY_CELL,
				endingOrNumber: report?.ending_or?.or_number || EMPTY_CELL,

				grandAccumulatedSalesEndingBalance: formatInPeso(
					report.grand_accumulated_sales_ending_balance,
				),
				grandAccumulatedSalesBeginningBalance: formatInPeso(
					report.grand_accumulated_sales_beginning_balance,
				),
				salesIssueWithManual: formatInPeso(report.sales_issue_with_manual),
				grossSalesForTheDay: formatInPeso(report.gross_sales_for_the_day),

				vatableSales: formatInPeso(report.vatable_sales),
				vatAmount: formatInPeso(report.vat_amount),
				vatExemptSales: formatInPeso(report.vat_exempt_sales),
				zeroRatedSales: formatInPeso(report.zero_rated_sales),

				scDiscount: formatInPeso(report.sc_discount),
				pwdDiscount: formatInPeso(report.pwd_discount),
				naacDiscount: formatInPeso(report.naac_discount),
				spDiscount: formatInPeso(report.sp_discount),
				othersDiscount: formatInPeso(report.others_discount),
				returns: formatInPeso(report.returns),
				void: formatInPeso(report.void),
				totalDeductions: formatInPeso(report.total_deductions),

				vatScDiscount: formatInPeso(report.vat_sc_discount),
				vatPwdDiscount: formatInPeso(report.vat_pwd_discount),
				vatOthersDiscount: formatInPeso(report.vat_others_discount),
				vatOnReturns: formatInPeso(report.vat_returns),
				vatOthers: formatInPeso(report.vat_others),
				totalVatAdjusted: formatInPeso(report.total_vat_adjusted),

				vatPayable: formatInPeso(report.vat_payable),
				netSales: formatInPeso(report.net_sales),
				salesOverrunOrOverflow: formatInPeso(report.sales_overrun_or_overflow),
				totalIncome: formatInPeso(report.total_income),
				resetCounter: report.reset_counter,
				zCounter: report.z_counter,
				remarks:
					Number(report.gross_sales_for_the_day) === 0
						? NO_TRANSACTION_REMARK
						: report.remarks,
			}));

			setDataSource(data);
		}
	}, [birReportsData?.list]);

	return (
		<>
			<TableHeader
				buttons={
					<PdfButtons
						key="pdf"
						downloadPdf={downloadPdf}
						isDisabled={isLoadingPdf}
						isLoading={isLoadingPdf || dataSource.length === 0}
						previewPdf={previewPdf}
					/>
				}
				title={tabs.BIR_SALES_SUMMARY_REPORT}
				wrapperClassName="pt-2 px-0"
			/>

			<Filter
				isLoading={
					(isFetchingBirReports && !isBirReportsFetched) ||
					isFetchingSiteSettings ||
					isLoadingPdf
				}
			/>

			<RequestErrors
				errors={[
					...convertIntoArray(siteSettingsError),
					...convertIntoArray(birReportsError),
				]}
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={
					(isFetchingBirReports && !isBirReportsFetched) ||
					isFetchingSiteSettings ||
					isLoadingPdf
				}
				pagination={{
					current: Number(params.page) || DEFAULT_PAGE,
					total: birReportsData?.total,
					pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
					onChange: (page, newPageSize) => {
						setQueryParams(
							{
								page,
								pageSize: newPageSize,
							},
							{ shouldResetPage: true },
						);
					},
					disabled: !dataSource,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				scroll={{ x: 5000 }}
				size="middle"
				bordered
			/>

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: htmlPdf }}
				style={{ display: 'none' }}
			/>
		</>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => (
	<Row className="mb-4" gutter={[16, 16]}>
		<Col lg={12} span={24}>
			<TimeRangeFilter disabled={isLoading} />
		</Col>
	</Row>
);
