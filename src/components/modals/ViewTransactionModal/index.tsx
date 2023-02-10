/* eslint-disable no-mixed-spaces-and-tabs */
import {
	FilePdfOutlined,
	FileTextOutlined,
	PrinterOutlined,
} from '@ant-design/icons';
import {
	Button,
	Descriptions,
	Modal,
	Space,
	Spin,
	Table,
	Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { ReceiptFooter, ReceiptHeader } from 'components/Receipt';
import { printSalesInvoice } from 'configurePrinter';
import { createSalesInvoiceTxt } from 'configureTxt';
import {
	EMPTY_CELL,
	JSPDF_SETTINGS,
	saleTypes,
	taxTypes,
	vatTypes,
} from 'global';
import { useSiteSettingsRetrieve, useTransactionRetrieve } from 'hooks';
import jsPDF from 'jspdf';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	formatDateTime,
	formatInPeso,
	formatQuantity,
	getFullName,
} from 'utils';

interface Props {
	transaction: any | number;
	onClose: any;
}

const { Text } = Typography;

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Qty', dataIndex: 'qty', align: 'center' },
	{ title: 'Rate', dataIndex: 'rate', align: 'center' },
	{ title: 'Subtotal', dataIndex: 'subtotal', align: 'center' },
];

export const ViewTransactionModal = ({ transaction, onClose }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [transactionData, setTransactionData] = useState(null);

	const [fields, setFields] = useState([]);
	const [isCreatingPdf, setIsCreatingPdf] = useState(false);
	const [isCreatingTxt, setIsCreatingTxt] = useState(false);
	const [html, setHtml] = useState('');
	const [title, setTitle] = useState('Invoice');

	// CUSTOM HOOKS
	const { data: siteSettings, isFetching: isFetchingSiteSettings } =
		useSiteSettingsRetrieve();
	const { data: transactionRetrieved, isFetching: isTransactionFetching } =
		useTransactionRetrieve({
			id: transaction,
			options: {
				enabled: _.isNumber(transaction),
			},
		});

	// METHODS
	useEffect(() => {
		// Set transaction products
		const products =
			transaction?.products || transactionRetrieved?.products || [];

		const formattedProducts = products.map((item) => ({
			key: item.id,
			name: `${item.branch_product.product.name} - ${
				item.branch_product.product.is_vat_exempted
					? vatTypes.VAT_EMPTY
					: vatTypes.VATABLE
			}`,
			qty:
				item.original_quantity ||
				formatQuantity({
					unitOfMeasurement: item.branch_product.product.unit_of_measurement,
					quantity: item.quantity,
				}),
			rate: formatInPeso(item.price_per_piece),
			subtotal: formatInPeso(item.quantity * item.price_per_piece),
		}));

		setDataSource(formattedProducts);
	}, [transaction, transactionRetrieved]);

	useEffect(() => {
		// Set transaction
		const newTransaction = _.isNumber(transaction)
			? transactionRetrieved
			: transaction;
		setTransactionData(newTransaction);

		// Set title
		if (newTransaction?.id) {
			if (newTransaction.payment.mode === saleTypes.CASH) {
				setTitle('CASH SALES INVOICE');
			} else if (newTransaction.payment.mode === saleTypes.CREDIT) {
				setTitle('CHARGE SALES INVOICE');
			}
		}

		// Set client fields
		let newFields = [];
		if (newTransaction?.discount_option_additional_fields_values?.length > 0) {
			const discountOptionFields = JSON.parse(
				newTransaction.discount_option_additional_fields_values,
			);

			newFields = Object.keys(discountOptionFields).map((key) => ({
				key,
				value: discountOptionFields[key],
			}));
		} else if (
			newTransaction?.client?.name ||
			newTransaction?.payment?.creditor_account
		) {
			newFields = [
				{
					key: 'NAME',
					value:
						newTransaction.client?.name ||
						getFullName(newTransaction.payment?.creditor_account) ||
						EMPTY_CELL,
				},
				{
					key: 'TIN',
					value:
						newTransaction.client?.tin ||
						newTransaction.payment?.creditor_account?.tin ||
						EMPTY_CELL,
				},
				{
					key: 'ADDRESS',
					value:
						newTransaction.client?.address ||
						newTransaction.payment?.creditor_account?.home_address ||
						EMPTY_CELL,
				},
			];
		}

		setFields(newFields);
	}, [transactionRetrieved, transaction]);

	const handleCreatePdf = () => {
		setIsCreatingPdf(true);

		// eslint-disable-next-line new-cap
		const pdf = new jsPDF(JSPDF_SETTINGS);

		const dataHtml = printSalesInvoice({
			transaction: transactionData,
			siteSettings,
			isPdf: true,
			isReprint: true,
		});

		setHtml(dataHtml);

		setTimeout(() => {
			pdf.html(dataHtml, {
				margin: 10,
				filename: `SalesInvoice_${transactionData.id}`,
				callback: (instance) => {
					window.open(instance.output('bloburl').toString());
					setIsCreatingPdf(false);
					setHtml('');
				},
			});
		}, 2000);
	};

	const handleCreateTxt = () => {
		setIsCreatingTxt(true);
		createSalesInvoiceTxt({
			transaction: transactionData,
			siteSettings,
			isReprint: true,
		});
		setIsCreatingTxt(false);
	};

	const handlePrint = () => {
		printSalesInvoice({
			transaction: transactionData,
			siteSettings,
			isReprint: true,
		});
	};

	return (
		<Modal
			className="Modal__hasFooter"
			footer={[
				<Button
					key="print"
					disabled={isCreatingPdf || isCreatingTxt}
					icon={<PrinterOutlined />}
					size="large"
					type="primary"
					onClick={handlePrint}
				>
					Print
				</Button>,
				<Button
					key="pdf"
					disabled={isCreatingPdf || isCreatingTxt}
					icon={<FilePdfOutlined />}
					loading={isCreatingPdf}
					size="large"
					type="primary"
					onClick={handleCreatePdf}
				>
					Create PDF
				</Button>,
				<Button
					key="txt"
					disabled={isCreatingPdf || isCreatingTxt}
					icon={<FileTextOutlined />}
					loading={isCreatingTxt}
					size="large"
					type="primary"
					onClick={handleCreateTxt}
				>
					Create TXT
				</Button>,
			]}
			title={title}
			width={425}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Spin spinning={isTransactionFetching || isFetchingSiteSettings}>
				{transactionData?.id && (
					<>
						{transactionData?.branch_machine && (
							<ReceiptHeader
								branchMachine={transactionData.branch_machine}
								title={title}
							/>
						)}

						<Table
							className="mt-6"
							columns={columns}
							dataSource={dataSource}
							pagination={false}
							size="small"
							bordered
						/>

						<Descriptions
							className="mt-6 w-100"
							colon={false}
							column={1}
							contentStyle={{
								textAlign: 'right',
								display: 'block',
							}}
							labelStyle={{
								width: 200,
							}}
							size="small"
						>
							{transactionData.discount_option && (
								<>
									<Descriptions.Item label="GROSS AMOUNT">
										{formatInPeso(transactionData.gross_amount)}&nbsp;
									</Descriptions.Item>
									{transactionData.invoice.vat_sales_discount > 0 && (
										<Descriptions.Item label="VAT AMOUNT">
											(
											{formatInPeso(transactionData.invoice.vat_sales_discount)}
											)
										</Descriptions.Item>
									)}
									<Descriptions.Item
										label={`DISCOUNT | ${transactionData.discount_option.code}`}
									>
										({formatInPeso(transactionData.overall_discount)})
									</Descriptions.Item>
								</>
							)}
							<Descriptions.Item
								contentStyle={{ fontWeight: 'bold' }}
								label="TOTAL AMOUNT"
							>
								{formatInPeso(transactionData.total_amount)}
							</Descriptions.Item>
						</Descriptions>

						{transactionData.payment.mode === saleTypes.CASH && (
							<Descriptions
								className="mt-6 w-100"
								colon={false}
								column={1}
								contentStyle={{
									textAlign: 'right',
									display: 'block',
								}}
								labelStyle={{
									width: 200,
									paddingLeft: 30,
								}}
								size="small"
							>
								<Descriptions.Item label="AMOUNT RECEIVED">
									{formatInPeso(transactionData.payment.amount_tendered)}
								</Descriptions.Item>
								<Descriptions.Item label="AMOUNT DUE">
									{formatInPeso(transactionData.total_amount)}
								</Descriptions.Item>
								<Descriptions.Item
									contentStyle={{ fontWeight: 'bold' }}
									label="CHANGE"
								>
									{formatInPeso(
										Number(transactionData.payment.amount_tendered) -
											Number(transactionData.total_amount),
									)}
								</Descriptions.Item>
							</Descriptions>
						)}

						{siteSettings.tax_type === taxTypes.VAT && (
							<Descriptions
								className="mt-6 w-100"
								colon={false}
								column={1}
								contentStyle={{
									textAlign: 'right',
									display: 'block',
								}}
								labelStyle={{
									width: 200,
								}}
								size="small"
							>
								<Descriptions.Item label="VAT Exempt">
									{formatInPeso(transactionData.invoice.vat_exempt)}
								</Descriptions.Item>
								<Descriptions.Item label="VAT Sales">
									{formatInPeso(transactionData.invoice.vat_sales)}
								</Descriptions.Item>
								<Descriptions.Item label="VAT Amount">
									{formatInPeso(transactionData.invoice.vat_amount)}
								</Descriptions.Item>
								<Descriptions.Item label="ZERO Rated">
									{formatInPeso(0)}
								</Descriptions.Item>
							</Descriptions>
						)}

						<Space className="mt-6 w-100 justify-space-between">
							<Text>
								{formatDateTime(transactionData.invoice.datetime_created)}
							</Text>
							<Text>{transactionData.teller.employee_id}</Text>
						</Space>
						<Space className="w-100 justify-space-between">
							<Text>{transactionData.invoice.or_number}</Text>
							<Text>{dataSource.length} item(s)</Text>
						</Space>

						{transactionData?.adjustment_remarks
							?.previous_voided_transaction && (
							<Space className="w-100 justify-space-between">
								<Text>
									Prev Invoice #:{' '}
									{
										transactionData.adjustment_remarks
											.previous_voided_transaction.invoice.or_number
									}
								</Text>
							</Space>
						)}
						{transactionData?.adjustment_remarks?.new_updated_transaction && (
							<Space className="w-100 justify-space-between">
								<Text>
									New Invoice #:{' '}
									{
										transactionData.adjustment_remarks.new_updated_transaction
											.invoice.or_number
									}
								</Text>
							</Space>
						)}

						{fields.length > 0 && (
							<Descriptions
								colon={false}
								column={1}
								labelStyle={{
									width: 200,
									paddingLeft: 15,
								}}
								size="small"
							>
								{fields.map(({ key, value }) => (
									<Descriptions.Item key={key} label={key}>
										{value}
									</Descriptions.Item>
								))}
							</Descriptions>
						)}

						<ReceiptFooter />
						<Text className="mt-4 d-block text-center">
							THIS INVOICE SHALL BE VALID FOR FIVE (5) YEARS FROM THE DATE OF
							PERMIT TO USE.
						</Text>
						<Text className="d-block text-center">
							THIS SERVES AS YOUR SALES INVOICE
						</Text>
						<Text className="d-block text-center">
							&quot;{siteSettings.thank_you_message}&quot;
						</Text>
					</>
				)}
			</Spin>

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>
		</Modal>
	);
};
