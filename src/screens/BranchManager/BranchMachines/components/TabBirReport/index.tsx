import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import { printBirReport } from 'configurePrinter';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
	timeRangeTypes,
} from 'global';
import {
	useBirReports,
	useQueryParams,
	useSiteSettingsRetrieve,
	useTimeRange,
} from 'hooks';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDate, formatInPeso } from 'utils/function';

const columns: ColumnsType = [
	{ title: 'Date', dataIndex: 'date' },
	{ title: 'Beginning SI/OR No.', dataIndex: 'beginningOrNumber' },
	{ title: 'Ending SI/OR No.', dataIndex: 'endingOrNumber' },
	{
		title: 'Grand Accum. Sales Ending Balance',
		dataIndex: 'grandAccumulatedSalesEndingBalance',
	},
	{
		title: 'Grand Accum. Sales Beginning Balance',
		dataIndex: 'grandAccumulatedSalesBeginningBalance',
	},
	{ title: 'Gross Sales For The Day', dataIndex: 'grossSalesForTheDay' },
	{
		title: 'Sales Issued with Manual SI/OR (per RR16-2018)',
		dataIndex: 'salesIssueWithManual',
	},
	{ title: 'Gross Sales From POS', dataIndex: 'grossSalesFromPos' },
	{ title: 'VATable Sales', dataIndex: 'vatableSales' },
	{ title: 'VAT Amount', dataIndex: 'vatAmount' },
	{ title: 'VAT-Exempt Sales', dataIndex: 'vatExemptSales' },
	{ title: 'Zero Rated Sales', dataIndex: 'zeroRatedSales' },
	{
		title: 'Deductions',
		children: [
			{ title: 'Regular Discount', dataIndex: 'regularDiscount' },
			{ title: 'Special Discount (SC/PWD)', dataIndex: 'specialDiscount' },
			{ title: 'Returns', dataIndex: 'returns' },
			{ title: 'Void', dataIndex: 'void' },
			{ title: 'Total Deductions', dataIndex: 'totalDeductions' },
		],
	},
	{
		title: 'Adjustments on VAT',
		children: [
			{ title: 'VAT On Special Discounts', dataIndex: 'vatOnSpecialDiscounts' },
			{ title: 'VAT On Returns', dataIndex: 'vatOnReturns' },
			{ title: 'Others', dataIndex: 'others' },
			{ title: 'Total VAT Adjusted', dataIndex: 'totalVatAdjusted' },
		],
	},
	{ title: 'VAT Payable', dataIndex: 'vatPayable' },
	{ title: 'Net Sales', dataIndex: 'netSales' },
	{ title: 'Other Income', dataIndex: 'otherIncome' },
	{ title: 'Sales Overrun/Overflow', dataIndex: 'salesOverrunOrOverflow' },
	{ title: 'Total Net Sales', dataIndex: 'totalNetSales' },
	{ title: 'Reset Counter', dataIndex: 'resetCounter' },
	{ title: 'Remarks', dataIndex: 'remarks' },
];

interface Props {
	branchMachineId: number;
	serverUrl: any;
}

export const TabBirReport = ({ branchMachineId, serverUrl }: Props) => {
	// STATES
	const [isPrinting, setIsPrinting] = useState(false);
	const [html, setHtml] = useState('');
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: siteSettings,
		isFetching: isSiteSettingsFetching,
		error: siteSettingsError,
	} = useSiteSettingsRetrieve({
		options: {
			refetchOnMount: 'always',
		},
	});
	const {
		data: { birReports, total },
		isFetching: isBirReportsFetching,
		error: birReportsError,
	} = useBirReports({
		params: {
			branchMachineId,
			timeRange: timeRangeTypes.DAILY,
			...queryParams,
		},
	});

	// METHODS
	useEffect(() => {
		const formattedReports = birReports.map((report) => ({
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
			grossSalesForTheDay: formatInPeso(report.gross_sales_for_the_day),
			salesIssueWithManual: formatInPeso(report.sales_issue_with_manual),
			grossSalesFromPos: formatInPeso(report.gross_sales_from_pos),
			vatableSales: formatInPeso(report.vatable_sales),
			vatAmount: formatInPeso(report.vat_amount),
			vatExemptSales: formatInPeso(report.vat_exempt_sales),
			zeroRatedSales: formatInPeso(report.zero_rated_sales),
			regularDiscount: formatInPeso(report.regular_discount),
			specialDiscount: formatInPeso(report.special_discount),
			returns: formatInPeso(report.returns),
			void: formatInPeso(report.void),
			totalDeductions: formatInPeso(report.total_deductions),
			vatOnSpecialDiscounts: formatInPeso(report.vat_on_special_discounts),
			vatOnReturns: formatInPeso(report.vat_on_returns),
			others: formatInPeso(report.others),
			totalVatAdjusted: formatInPeso(report.total_vat_adjusted),
			vatPayable: formatInPeso(report.vat_payable),
			netSales: formatInPeso(report.net_sales),
			otherIncome: formatInPeso(report.other_income),
			salesOverrunOrOverflow: formatInPeso(report.sales_overrun_or_overflow),
			totalNetSales: formatInPeso(report.total_net_sales),
			resetCounter: report.reset_counter,
			remarks:
				Number(report.gross_sales_for_the_day) === 0
					? 'No transaction'
					: report.remarks,
		}));

		setDataSource(formattedReports);
	}, [birReports]);

	const onPrintPDF = () => {
		setIsPrinting(true);

		const dataHtml = printBirReport({
			birReports,
			siteSettings,
		});
		const pdf = new jsPDF({
			orientation: 'l',
			unit: 'px',
			format: [1800, 840],
			hotfixes: ['px_scaling'],
			putOnlyUsedFonts: true,
		});

		setHtml(dataHtml);

		setTimeout(() => {
			pdf.html(dataHtml, {
				margin: 10,
				filename: `BirReport_`,
				callback: (instance) => {
					window.open(instance.output('bloburl').toString());
					setIsPrinting(false);
					setHtml('');
				},
			});
		}, 500);
	};

	return (
		<>
			<TableHeader
				title="BIR Report"
				buttonName="Print PDF"
				onCreate={onPrintPDF}
				onCreateDisabled={isPrinting}
			/>

			<Filter
				isLoading={isBirReportsFetching || isSiteSettingsFetching || isPrinting}
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
				scroll={{ x: 3000 }}
				pagination={{
					current: Number(queryParams.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(queryParams.pageSize) || DEFAULT_PAGE_SIZE,
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
				size="middle"
				loading={isBirReportsFetching || isSiteSettingsFetching || isPrinting}
				bordered
			/>

			<div
				dangerouslySetInnerHTML={{
					__html: html,
				}}
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
