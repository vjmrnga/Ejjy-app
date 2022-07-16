import { Col, Radio, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	ModeOfPayment,
	RequestErrors,
	TableHeader,
	TimeRangeFilter,
	TransactionStatus,
	ViewTransactionModal,
} from 'components';
import { ButtonLink, Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
	refetchOptions,
	timeRangeTypes,
	transactionStatus,
} from 'global';
import { useQueryParams, useTransactionProducts } from 'hooks';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDate,
	formatInPeso,
	formatQuantity,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'Date & Time', dataIndex: 'dateTime', width: 125 },
	{ title: 'Client Code / Name', dataIndex: 'client', width: 150 },
	{ title: 'Invoice Number', dataIndex: 'invoiceNumber', width: 150 },
	{ title: 'Invoice Type', dataIndex: 'invoiceType', width: 150 },
	{ title: 'Quantity', dataIndex: 'quantity' },
	{ title: 'Code / Barcode', dataIndex: 'code', width: 150 },
	{ title: 'Item Name / Description', dataIndex: 'name', width: 300 },
	{ title: 'Sale Price', dataIndex: 'sellingPrice', width: 150 },
	{ title: 'V/VE', dataIndex: 'vatable' },
	{ title: 'Total Amount', dataIndex: 'totalAmount', width: 150 },
	{ title: 'Remarks', dataIndex: 'remarks' },
];

interface Props {
	branchMachineId: number;
}

export const TabDailyProductSalesReport = ({ branchMachineId }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { transactionProducts, total },
		isFetching: isTransactionProductsFetching,
		isFetched: isTransactionProductsFetched,
		error: transactionProductsError,
	} = useTransactionProducts({
		params: {
			...params,
			branchMachineId,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
			isVatExempted: params.isVatExempted
				? params.isVatExempted === 'true'
				: undefined,
			statuses: params.statuses || undefined,
		},
		options: refetchOptions,
	});

	// METHODS
	useEffect(() => {
		const data = transactionProducts.map((transactionProduct) => {
			const {
				id,
				datetime_created,
				transaction,
				quantity,
				branch_product,
				price_per_piece,
				amount,
			} = transactionProduct;
			const product = branch_product?.product || {};

			const modeOfPayment = (
				<ModeOfPayment modeOfPayment={transaction.payment.mode} />
			);

			const remarks = [
				transactionStatus.VOID_CANCELLED,
				transactionStatus.VOID_EDITED,
			].includes(transaction.status) && (
				<TransactionStatus status={transaction.status} />
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
				quantity: formatQuantity({
					unitOfMeasurement: product?.unit_of_measurement,
					quantity: quantity,
				}),
				code: `${product?.textcode || ''} / ${
					product?.barcode || product?.selling_barcode || ''
				}`,
				name: `${product?.name} / ${product?.description}`,
				sellingPrice: formatInPeso(price_per_piece),
				vatable: product?.is_vat_exempted ? 'VAT Exempt' : 'Vatable',
				totalAmount: formatInPeso(amount),
				remarks,
			};
		});

		setDataSource(data);
	}, [transactionProducts]);

	return (
		<>
			<TableHeader title="Daily Product Sales" />

			<Filter
				isLoading={
					isTransactionProductsFetching && !isTransactionProductsFetched
				}
			/>

			<RequestErrors errors={convertIntoArray(transactionProductsError)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 1400 }}
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
				loading={isTransactionProductsFetching && !isTransactionProductsFetched}
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
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	const { params, setQueryParams } = useQueryParams();

	return (
		<Row className="mb-4" gutter={[16, 16]}>
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
							label: 'All',
							value: '',
						},
						{
							label: 'VAT',
							value: 'false',
						},
						{
							label: 'VAT-Exempt',
							value: 'true',
						},
					]}
					onChange={(e) => {
						setQueryParams(
							{ isVatExempted: e.target.value },
							{ shouldResetPage: true },
						);
					}}
					optionType="button"
				/>
			</Col>
			<Col lg={12} span={24}>
				<Label label="Status" spacing />
				<Radio.Group
					value={params.statuses}
					defaultValue=""
					options={[
						{
							label: 'All',
							value: '',
						},
						{
							label: 'Success',
							value: 'fully_paid',
						},
						{
							label: 'Voided',
							value: 'void_edited,void_cancelled',
						},
					]}
					onChange={(e) => {
						setQueryParams(
							{ statuses: e.target.value },
							{ shouldResetPage: true },
						);
					}}
					optionType="button"
				/>
			</Col>
		</Row>
	);
};
