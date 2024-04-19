import { Col, Row } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import {
	BranchMachine,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	NaacFields,
	PWDFields,
	PdfButtons,
	SCFields,
	SPFields,
	SpecialDiscountCode,
	TransactionsService,
	convertIntoArray,
	formatDate,
	formatInPeso,
	getDiscountFields,
	printBirReportNAAC,
	printBirReportPWD,
	printBirReportSC,
	printBirReportSP,
	timeRangeTypes,
	usePdf,
	useQueryParams,
	useTransactions,
} from 'ejjy-global';
import { pageSizeOptions, refetchOptions } from 'global';
import { useSiteSettingsNew } from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import { getLocalApiUrl } from 'utils';
import { tabs } from './data';

type Props = {
	branchMachine: BranchMachine;
	discountCode: SpecialDiscountCode;
	category: string;
};

export const AnnexTransactionsTab = ({
	branchMachine,
	category,
	discountCode,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const { params, setQueryParams } = useQueryParams();
	const {
		data: siteSettings,
		isFetching: isFetchingSiteSettings,
		error: siteSettingsError,
	} = useSiteSettingsNew();
	const {
		data: transactionsData,
		isFetching: isFetchingTransactions,
		error: transactionsError,
	} = useTransactions({
		params: {
			timeRange: timeRangeTypes.DAILY,
			branchMachineId: branchMachine.id,
			discountCode,
			...params,
		},
		options: refetchOptions,
		serviceOptions: {
			baseURL: getLocalApiUrl(),
		},
	});
	const { htmlPdf, isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		title: `BIR_Reports.pdf`,
		print: async () => {
			let content = '';

			const response = await TransactionsService.list(
				{
					branch_machine_id: branchMachine.id,
					discount_code: discountCode,
					page_size: MAX_PAGE_SIZE,
					page: DEFAULT_PAGE,
					time_range: params?.timeRange as string,
				},
				getLocalApiUrl(),
			);

			const transactions = response.results;

			if (category === tabs.NATIONAL_ATHLETES_AND_COACHES_SALES_REPORT) {
				content = printBirReportNAAC(
					transactions,
					siteSettings,
					user,
					branchMachine,
				);
			} else if (category === tabs.SOLO_PARENTS_SALES_REPORT) {
				content = printBirReportSP(
					transactions,
					siteSettings,
					user,
					branchMachine,
				);
			} else if (category === tabs.SENIOR_CITIZEN_SALES_REPORT) {
				content = printBirReportSC(
					transactions,
					siteSettings,
					user,
					branchMachine,
				);
			} else if (category === tabs.PERSONS_WITH_DISABILITY_SALES_REPORT) {
				content = printBirReportPWD(
					transactions,
					siteSettings,
					user,
					branchMachine,
				);
			}

			return content;
		},
		jsPdfSettings: {
			orientation: 'l',
			unit: 'px',
			format: [1800, 840],
			precision: 1,
		},
	});

	// METHODS
	useEffect(() => {
		if (transactionsData?.list && discountCode) {
			const listPwdSc = [
				tabs.SENIOR_CITIZEN_SALES_REPORT,
				tabs.PERSONS_WITH_DISABILITY_SALES_REPORT,
			];
			const listNaacSp = [
				tabs.NATIONAL_ATHLETES_AND_COACHES_SALES_REPORT,
				tabs.SOLO_PARENTS_SALES_REPORT,
			];

			const data = transactionsData.list.map((transaction) => {
				const content = {
					key: transaction.id,
					date: formatDate(transaction.datetime_created),
					orNumber: transaction.invoice.or_number,
					netSales: formatInPeso(transaction.invoice.vat_sales),
				};

				let fields = getDiscountFields(
					discountCode,
					transaction.discount_option_additional_fields_values || '',
				);

				if (category === tabs.NATIONAL_ATHLETES_AND_COACHES_SALES_REPORT) {
					fields = fields as NaacFields;

					content['coach'] = fields.coach;
					content['id'] = fields.id;
				} else if (category === tabs.SOLO_PARENTS_SALES_REPORT) {
					fields = fields as SPFields;

					content['name'] = fields.name;
					content['id'] = fields.id;
					content['childName'] = fields.childName;
					content['childBirthdate'] = fields.childBirthdate;
					content['childAge'] = fields.childAge;
				} else if (category === tabs.SENIOR_CITIZEN_SALES_REPORT) {
					fields = fields as SCFields;

					content['name'] = fields.name;
					content['id'] = fields.id;
					content['tin'] = fields.tin;
				} else if (category === tabs.PERSONS_WITH_DISABILITY_SALES_REPORT) {
					fields = fields as PWDFields;

					content['name'] = fields.name;
					content['id'] = fields.id;
					content['tin'] = fields.tin;
				}

				if (listNaacSp.includes(category)) {
					content['gross'] = formatInPeso(transaction.gross_amount);
					content['salesDiscount'] = formatInPeso(transaction.overall_discount);
				}

				if (listPwdSc.includes(category)) {
					content['sales'] = formatInPeso(transaction.total_amount);
					content['vatAmount'] = formatInPeso(transaction.invoice.vat_amount);
					content['vatExemptSales'] = formatInPeso(
						transaction.invoice.vat_exempt,
					);
					content['5%'] = formatInPeso(0);
					content['20%'] = formatInPeso(transaction.overall_discount);
				}

				return content;
			});

			setDataSource(data);
		}
	}, [transactionsData?.list, category]);

	const getColumns = useCallback((): ColumnsType => {
		const categoryColumnsMap = {
			[tabs.NATIONAL_ATHLETES_AND_COACHES_SALES_REPORT]: [
				{ title: 'Name of National Athlete/Coach', dataIndex: 'coach' },
				{ title: 'PNSTM ID No.', dataIndex: 'id' },
			],
			[tabs.SOLO_PARENTS_SALES_REPORT]: [
				{ title: 'Name of Solo Parent', dataIndex: 'name' },
				{ title: 'SPIC No.', dataIndex: 'id' },
				{ title: 'Name of child', dataIndex: 'childName' },
				{ title: 'Birth Date of child', dataIndex: 'childBirthdate' },
				{ title: 'Age of child', dataIndex: 'childAge' },
			],
			[tabs.SENIOR_CITIZEN_SALES_REPORT]: [
				{ title: 'Name of Senior Citizen (SC)', dataIndex: 'name' },
				{ title: 'OSCA ID No./ SC ID No.', dataIndex: 'id' },
				{ title: 'SC TIN', dataIndex: 'tin' },
			],
			[tabs.PERSONS_WITH_DISABILITY_SALES_REPORT]: [
				{ title: 'Name of Person with Disability (PWD)', dataIndex: 'name' },
				{ title: 'PWD ID No.', dataIndex: 'id' },
				{ title: 'PWD TIN', dataIndex: 'tin' },
			],
		};

		const columnsNaacSp = [
			{ title: 'Gross Sales/Receipts', dataIndex: 'gross' },
			{ title: 'Sales Discount (VAT+Disc)', dataIndex: 'salesDiscount' },
		];

		const columnsScPwd = [
			{ title: 'Sales (inclusive of VAT)', dataIndex: 'sales' },
			{ title: 'VAT Amount', dataIndex: 'vatAmount' },
			{ title: 'VAT Exempt Sales', dataIndex: 'vatExemptSales' },
			{
				title: 'Discount',
				children: [
					{ title: '5%', dataIndex: '5%' },
					{ title: '20%', dataIndex: '20%' },
				],
			},
		];

		const salesColumnsMap = {
			[tabs.NATIONAL_ATHLETES_AND_COACHES_SALES_REPORT]: columnsNaacSp,
			[tabs.SOLO_PARENTS_SALES_REPORT]: columnsNaacSp,
			[tabs.SENIOR_CITIZEN_SALES_REPORT]: columnsScPwd,
			[tabs.PERSONS_WITH_DISABILITY_SALES_REPORT]: columnsScPwd,
		};

		return [
			{ title: 'Date', dataIndex: 'date' },
			...(categoryColumnsMap[category] || []),
			{ title: 'SI / OR Number', dataIndex: 'orNumber' },
			...(salesColumnsMap[category] || []),
			{ title: 'Net Sales', dataIndex: 'netSales' },
		];
	}, [category]);

	return (
		<>
			<TableHeader
				buttons={
					<PdfButtons
						key="pdf"
						downloadPdf={downloadPdf}
						isDisabled={isLoadingPdf || !transactionsData?.list}
						isLoading={isLoadingPdf || isFetchingTransactions}
						previewPdf={previewPdf}
					/>
				}
				title={category}
				wrapperClassName="pt-2 px-0"
			/>

			<Filter />

			<RequestErrors
				errors={[
					...convertIntoArray(transactionsError, 'Transactions'),
					...convertIntoArray(siteSettingsError, 'Site Settings'),
				]}
			/>

			<Table
				columns={getColumns()}
				dataSource={dataSource}
				loading={isFetchingSiteSettings || isLoadingPdf}
				pagination={{
					current: Number(params.page) || DEFAULT_PAGE,
					total: transactionsData?.total,
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
				scroll={{ x: 1500 }}
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

const Filter = () => (
	<Row className="mb-4" gutter={[16, 16]}>
		<Col lg={12} span={24}>
			<TimeRangeFilter />
		</Col>
	</Row>
);
