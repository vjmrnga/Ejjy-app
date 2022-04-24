import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Radio, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	ModeOfPayment,
	RequestErrors,
	RequestWarnings,
	TableHeader,
	TimeRangeFilter,
	ViewTransactionModal,
} from 'components';
import { ButtonLink, Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
	SEARCH_DEBOUNCE_TIME,
	timeRangeTypes,
} from 'global';
import {
	useQueryParams,
	useTransactionProducts,
	useTransactionProductsSummary,
	useTransactions,
} from 'hooks';
import { useTimeRange } from 'hooks/useTimeRange';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { DailyProductSalesReportTotal } from 'screens/BranchManager/BranchMachines/components/TabDailyProductSalesReport/components/DailyProductSalesReportTotal';
import {
	convertIntoArray,
	formatDate,
	formatInPeso,
	formatQuantity,
} from 'utils/function';

const columns: ColumnsType = [
	{ title: 'Date & Time', dataIndex: 'dateTime', width: 125 },
	{ title: 'Client Code / Name', dataIndex: 'client', width: 150 },
	{ title: 'Invoice Number', dataIndex: 'invoiceNumber', width: 150 },
	{ title: 'Invoice Type', dataIndex: 'invoiceType', width: 150 },
	{ title: 'Quantity', dataIndex: 'quantity' },
	{ title: 'Code / Barcode', dataIndex: 'code', width: 150 },
	{ title: 'Item Name / Description', dataIndex: 'name', width: 300 },
	{ title: 'Selling Price', dataIndex: 'sellingPrice', width: 150 },
	{ title: 'V/VE', dataIndex: 'vatable' },
	{ title: 'Total Amount', dataIndex: 'totalAmount', width: 150 },
];

interface Props {
	branchMachineId: number;
	serverUrl: any;
}

export const TabDailyProductSalesReport = ({
	branchMachineId,
	serverUrl,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: { transactionProducts, total, warning: transactionProductsWarning },
		isFetching: isTransactionProductsFetching,
		error: transactionProductsError,
	} = useTransactionProducts({
		params: {
			branchMachineId,
			serverUrl,
			...queryParams,
			isVatExempted: queryParams.isVatExempted
				? queryParams.isVatExempted === 'true'
				: undefined,
		},
	});
	const {
		data: { summary = null } = {},
		isFetching: isTransactionProductsSummaryFetching,
		error: transactionProductsSummaryError,
	} = useTransactionProductsSummary({
		params: {
			branchMachineId,
			serverUrl,
			...queryParams,
			isVatExempted: queryParams.isVatExempted
				? queryParams.isVatExempted === 'true'
				: undefined,
		},
	});

	// METHODS
	useEffect(() => {
		const data = transactionProducts.map((transactionProduct) => {
			const {
				id,
				datetime_created,
				transaction,
				quantity,
				branch_product: { product },
				price_per_piece,
				amount,
			} = transactionProduct;

			const modeOfPayment = (
				<ModeOfPayment modeOfPayment={transaction.payment.mode} />
			);

			return {
				key: id,
				dateTime: formatDate(datetime_created),
				client: transaction.client ? (
					`${transaction.client.id || ''} / ${transaction.client.name || ''}`
				) : (
					<>
						<span>walk-in</span> {modeOfPayment}
					</>
				),
				invoiceNumber: transaction.invoice ? (
					<ButtonLink
						text={transaction.invoice.or_number}
						onClick={() => setSelectedTransaction(transaction.id)}
					/>
				) : (
					EMPTY_CELL
				),
				invoiceType: <ModeOfPayment modeOfPayment={transaction.payment.mode} />,
				quantity: formatQuantity(product.unit_of_measurement, quantity),
				code: `${product.textcode} / ${product.barcode}`,
				name: `${product.name} / ${product.description}`,
				sellingPrice: formatInPeso(price_per_piece),
				vatable: product.is_vat_exempted ? 'VAT Exempt' : 'Vatable',
				totalAmount: formatInPeso(amount),
			};
		});

		setDataSource(data);
	}, [transactionProducts]);

	return (
		<>
			<TableHeader title="Daily Product Sales" />

			<Filter
				params={queryParams}
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
				isLoading={
					isTransactionProductsFetching || isTransactionProductsSummaryFetching
				}
			/>

			{summary && (
				<DailyProductSalesReportTotal
					totalSales={summary.total_sales}
					totalVatSales={summary.total_vat_sales}
					totalVatExemptSales={summary.total_vat_exempt_sales}
				/>
			)}

			<RequestErrors
				errors={[
					...convertIntoArray(transactionProductsError, 'Transaction Products'),
					...convertIntoArray(
						transactionProductsSummaryError,
						'Transaction Products Summary',
					),
				]}
			/>
			<RequestWarnings
				warnings={convertIntoArray(transactionProductsWarning)}
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 1400 }}
				pagination={{
					current: Number(queryParams.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(queryParams.pageSize) || DEFAULT_PAGE_SIZE,
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
				loading={
					isTransactionProductsFetching || isTransactionProductsSummaryFetching
				}
			/>

			{selectedTransaction && (
				<ViewTransactionModal
					transaction={selectedTransaction}
					onClose={() => setSelectedTransaction(null)}
				/>
			)}
		</>
	);
};

interface FilterProps {
	params: any;
	isLoading: boolean;
	setQueryParams: any;
}

const Filter = ({ params, isLoading, setQueryParams }: FilterProps) => {
	// STATES
	const [invoiceSearch, setInvoiceSearch] = useState('');

	// CUSTOM HOOKS
	const {
		data: { transactions },
		isFetching,
	} = useTransactions({ params: { orNumber: invoiceSearch } });

	const onSearchDebounced = useCallback(
		_.debounce((search) => {
			setQueryParams({ orNumber: search });
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Invoice #" spacing />
				<Input
					prefix={<SearchOutlined />}
					defaultValue={params.search}
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
					allowClear
				/>
			</Col>

			<Col lg={12} span={24}>
				<TimeRangeFilter disabled={isLoading} />
			</Col>

			<Col lg={12} span={24}>
				<Label label="V/VE" spacing />
				<Radio.Group
					value={params.isVatExempted}
					defaultValue=""
					options={[
						{
							label: 'ALL',
							value: '',
						},
						{
							label: 'VAT',
							value: 'false',
						},
						{
							label: 'VAT-EXEMPT',
							value: 'true',
						},
					]}
					onChange={(e) => {
						const { value } = e.target;
						setQueryParams({ isVatExempted: value });
					}}
					optionType="button"
				/>
			</Col>
		</Row>
	);
};
