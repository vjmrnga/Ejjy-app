import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import {
	RequestErrors,
	TableHeader,
	ViewTransactionModal,
} from '../../../../../components';
import { printOrderOfPayment } from '../../../../../configurePrinter';
import { EMPTY_CELL } from '../../../../../global/constants';
import { pageSizeOptions } from '../../../../../global/options';
import { orderOfPaymentPurposes } from '../../../../../global/types';
import useOrderOfPayments from '../../../../../hooks/useOrderOfPayments';
import { useQueryParams } from '../../../../../hooks/useQueryParams';
import {
	convertIntoArray,
	formatDateTime,
	formatInPeso,
	getFullName,
} from '../../../../../utils/function';
import { CreateOrderOfPaymentModal } from './CreateOrderOfPaymentModal';

const columns: ColumnsType = [
	{ title: 'OP #', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Payor', dataIndex: 'payor' },
	{ title: 'Address', dataIndex: 'address' },
	{ title: 'Amount of Payment', dataIndex: 'amount_of_payment' },
	{ title: 'Purpose', dataIndex: 'purpose' },
	{ title: 'Charge Sales Invoice', dataIndex: 'charge_sales_invoice' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabOrderOfPayments = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	// NOTE: Will store the ID of the order of payment that is about to be printed.
	const [isPrinting, setIsPrinting] = useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: { orderOfPayments, total },
		refetch: refetchOrderOfPayments,
		isFetching,
		error,
	} = useOrderOfPayments({ params: {} });

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
				datetime_created: formatDateTime(datetime_created),
				payor: getFullName(payor),
				address: payor.home_address,
				amount_of_payment: formatInPeso(amount),
				purpose: purposeDescription,
				charge_sales_invoice: charge_sales_transaction ? (
					<>
						<Button
							type="link"
							onClick={() => setSelectedTransaction(orderOfPayment)}
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
					<Button
						type="link"
						onClick={() => onPrintPDF(orderOfPayment)}
						loading={isPrinting === id}
					>
						Print PDF
					</Button>
				),
			};
		});

		setDataSource(formattedOrderOfPayments);
	}, [orderOfPayments, isPrinting]);

	const onPrintPDF = (orderOfPayment) => {
		setIsPrinting(orderOfPayment.id);

		const html = printOrderOfPayment(orderOfPayment);
		const pdf = new jsPDF({
			orientation: 'p',
			unit: 'px',
			format: 'legal',
			hotfixes: ['px_scaling'],
		});

		setTimeout(() => {
			pdf.html(html, {
				filename: `OP_${orderOfPayment.id}`,
				callback: (instance) => {
					window.open(instance.output('bloburl').toString());
					setIsPrinting(null);
				},
			});
		}, 500);
	};

	return (
		<div>
			<TableHeader
				title="Order of Payments"
				buttonName="Create Order of Payment"
				onCreate={() => setIsCreateModalVisible(true)}
			/>

			<RequestErrors errors={convertIntoArray(error)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 1200 }}
				pagination={{
					current: Number(queryParams.page) || 1,
					total,
					pageSize: Number(queryParams.pageSize) || 10,
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
				loading={isFetching}
			/>

			{selectedTransaction && (
				<ViewTransactionModal
					transaction={selectedTransaction}
					onClose={() => setSelectedTransaction(null)}
				/>
			)}

			{isCreateModalVisible && (
				<CreateOrderOfPaymentModal
					onSuccess={refetchOrderOfPayments}
					onClose={() => setIsCreateModalVisible(false)}
				/>
			)}
		</div>
	);
};
