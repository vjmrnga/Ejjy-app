import { Button, Col, Row, Select, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	RequestErrors,
	TableHeader,
	TimeRangeFilter,
	ViewTransactionModal,
} from 'components';
import { Label } from 'components/elements';
import { PdfButtons } from 'components/Printing';
import { printOrderOfPayment } from 'configurePrinter';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	orderOfPaymentPurposes,
	pageSizeOptions,
	SEARCH_DEBOUNCE_TIME,
	timeRangeTypes,
} from 'global';
import { useAccounts, useOrderOfPayments, usePdf, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDateTime,
	formatInPeso,
	getFullName,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'OP #', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime' },
	{ title: 'Payor', dataIndex: 'payor' },
	{ title: 'Address', dataIndex: 'address' },
	{ title: 'Amount of Payment', dataIndex: 'amountOfPayment' },
	{ title: 'Purpose', dataIndex: 'purpose' },
	{ title: 'Charge Sales Invoice', dataIndex: 'chargeSalesInvoice' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabOrderOfPayments = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { orderOfPayments, total },
		isFetching: isFetchingOrderOfPayments,
		error: orderOfPaymentsError,
	} = useOrderOfPayments({
		params: {
			...params,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
		},
	});
	const { isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		jsPdfSettings: { format: 'legal' },
		print: (data) => printOrderOfPayment(data),
	});

	// METHODS
	useEffect(() => {
		const formattedOrderOfPayments = orderOfPayments.map((orderOfPayment) => {
			const {
				id,
				datetime_created,
				amount,
				payor,
				purpose,
				extra_description,
				charge_sales_transaction,
			} = orderOfPayment;

			let purposeDescription = extra_description;
			if (purpose === orderOfPaymentPurposes.PARTIAL_PAYMENT) {
				purposeDescription = 'Partial Payment';
			} else if (purpose === orderOfPaymentPurposes.FULL_PAYMENT) {
				purposeDescription = 'Full Payment';
			}

			return {
				key: id,
				id,
				datetime: formatDateTime(datetime_created),
				payor: getFullName(payor),
				address: payor.home_address,
				amountOfPayment: formatInPeso(amount),
				purpose: purposeDescription,
				chargeSalesInvoice: charge_sales_transaction?.invoice ? (
					<>
						<Button
							className="pa-0"
							type="link"
							onClick={() => setSelectedTransaction(charge_sales_transaction)}
						>
							{charge_sales_transaction.invoice.or_number}
						</Button>
						<span>
							{' '}
							-{' '}
							{formatDateTime(
								charge_sales_transaction.invoice.datetime_created,
							)}
						</span>
					</>
				) : (
					EMPTY_CELL
				),
				actions: (
					<PdfButtons
						key="pdf"
						downloadPdf={() =>
							downloadPdf({
								title: `OP_${orderOfPayment.id}.pdf`,
								printData: orderOfPayment,
							})
						}
						isDisabled={isLoadingPdf}
						previewPdf={() =>
							previewPdf({
								title: `OP_${orderOfPayment.id}.pdf`,
								printData: orderOfPayment,
							})
						}
					/>
				),
			};
		});

		setDataSource(formattedOrderOfPayments);
	}, [orderOfPayments]);

	return (
		<div>
			<TableHeader title="Order of Payments" wrapperClassName="pt-2 px-0" />

			<RequestErrors
				errors={convertIntoArray(orderOfPaymentsError)}
				withSpaceBottom
			/>

			<Filter isLoading={isFetchingOrderOfPayments} />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingOrderOfPayments || isLoadingPdf}
				pagination={{
					current: Number(params.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
					onChange: (page, newPageSize) => {
						setQueryParams({
							page,
							pageSize: newPageSize,
						});
					},
					disabled: !dataSource,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				scroll={{ x: 1200 }}
				bordered
			/>

			{selectedTransaction && (
				<ViewTransactionModal
					transaction={selectedTransaction}
					onClose={() => setSelectedTransaction(null)}
				/>
			)}
		</div>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	// STATES
	const [accountSearch, setAccountSearch] = useState('');

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { accounts },
		isFetching: isFetchingAccounts,
	} = useAccounts({ params: { search: accountSearch } });

	// METHODS
	const handleSearchDebounced = useCallback(
		_.debounce((search) => {
			setAccountSearch(search);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Payor" spacing />
				<Select
					className="w-100"
					defaultActiveFirstOption={false}
					filterOption={false}
					notFoundContent={isFetchingAccounts ? <Spin size="small" /> : null}
					value={params.payorId ? Number(params.payorId) : null}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ payorId: value }, { shouldResetPage: true });
					}}
					onSearch={handleSearchDebounced}
				>
					{accounts.map((account) => (
						<Select.Option key={account.id} value={account.id}>
							{getFullName(account)}
						</Select.Option>
					))}
				</Select>
			</Col>
			<Col lg={12} span={24}>
				<TimeRangeFilter disabled={isLoading} />
			</Col>
		</Row>
	);
};
