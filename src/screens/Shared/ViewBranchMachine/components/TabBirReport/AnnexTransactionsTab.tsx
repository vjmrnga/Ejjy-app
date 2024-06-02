import { Col, Row } from 'antd';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import {
	BirAnnexTransactions,
	BranchMachine,
	DEFAULT_PAGE,
	MAX_PAGE_SIZE,
	PdfButtons,
	SpecialDiscountCode,
	TransactionsService,
	convertIntoArray,
	printBirReportNAAC,
	printBirReportPWD,
	printBirReportSC,
	printBirReportSP,
	timeRangeTypes,
	usePdf,
	useQueryParams,
	useTransactions,
} from 'ejjy-global';
import { refetchOptions } from 'global';
import { useSiteSettingsNew } from 'hooks';
import { useUserStore } from 'stores';
import { getLocalApiUrl } from 'utils';
import React from 'react';
import { birAnnexTransactionsTabs as tabs } from 'ejjy-global/dist/components/BirAnnexTransactions/data';

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
	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const { params } = useQueryParams();
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
		title: (() => {
			let title = '';

			if (discountCode === 'SC') {
				title = 'AnnexE2_00';
			} else if (discountCode === 'PWD') {
				title = 'AnnexE3_00';
			} else if (discountCode === 'NAAC') {
				title = 'AnnexE4_00';
			} else if (discountCode === 'SP') {
				title = 'AnnexE5_00';
			}

			return title;
		})(),
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

			<BirAnnexTransactions
				category={category}
				discountCode={discountCode}
				isLoading={
					isFetchingSiteSettings || isFetchingTransactions || isLoadingPdf
				}
				siteSettings={siteSettings}
				transactions={transactionsData?.list}
				transactionsTotal={transactionsData?.total}
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
