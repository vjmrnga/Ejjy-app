/* eslint-disable no-mixed-spaces-and-tabs */
import { Descriptions, Modal, Space, Spin, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Button } from 'components/elements';
import { ReceiptFooter, ReceiptHeader } from 'components/Receipt';
import { EMPTY_CELL, saleTypes } from 'global';
import { useSiteSettingsRetrieve, useTransactionRetrieve } from 'hooks';
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
	branchMachineId?: number;
	serverUrl?: string;
	onClose: any;
}

const { Text, Title } = Typography;

const columns: ColumnsType = [
	{ title: 'Item', dataIndex: 'item' },
	{ title: 'Quantity', dataIndex: 'quantity', align: 'center' },
	{ title: 'Rate', dataIndex: 'rate', align: 'right' },
	{ title: 'Amount', dataIndex: 'amount', align: 'right' },
];

export const ViewTransactionModal = ({
	transaction,
	branchMachineId,
	serverUrl,
	onClose,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [transactionData, setTransactionData] = useState(null);
	const [discountOptionFields, setDiscountOptionFields] = useState(null);
	const [defaultClientName, setDefaultClientName] = useState('');
	const [title, setTitle] = useState('Invoice');

	// CUSTOM HOOKS
	const { data: siteSettings, isFetching: isSiteSettingsFetching } =
		useSiteSettingsRetrieve({
			options: {
				refetchOnMount: 'always',
			},
		});
	const { data: transactionRetrieved, isFetching: isTransactionFetching } =
		useTransactionRetrieve({
			id: transaction,
			params: {
				branchMachineId,
				serverUrl,
			},
			options: {
				enabled: _.isNumber(transaction),
			},
		});

	// METHODS
	useEffect(() => {
		// Set transaction
		const newTransaction = _.isNumber(transaction)
			? transactionRetrieved
			: transaction;
		setTransactionData(newTransaction);

		// Set transaction products
		const products =
			transaction?.products || transactionRetrieved?.products || [];
		const formattedProducts = products.map(
			({ id, branch_product, quantity, price_per_piece }) => ({
				key: id,
				item: branch_product.product.name,
				quantity: formatQuantity({
					unitOfMeasurement: branch_product.product.unit_of_measurement,
					quantity: quantity,
				}),
				rate: formatInPeso(price_per_piece),
				amount: formatInPeso(quantity * Number(price_per_piece)),
			}),
		);
		setDataSource(formattedProducts);

		// Set discount option additional fields
		if (newTransaction?.discount_option_additional_fields_values?.length > 0) {
			const discountOptionFieldsJSON = JSON.parse(
				newTransaction.discount_option_additional_fields_values,
			);
			setDiscountOptionFields(discountOptionFieldsJSON);
		}
	}, [transaction, transactionRetrieved]);

	useEffect(() => {}, [transactionRetrieved, transaction]);

	useEffect(() => {
		if (transactionData?.id) {
			if (transactionData.payment.mode === saleTypes.CASH) {
				setDefaultClientName('walk-in cash');
				setTitle('CASH SALES INVOICE');
			} else if (transactionData.payment.mode === saleTypes.CREDIT) {
				setDefaultClientName('walk-in credit');
				setTitle('CHARGE SALES INVOICE');
			}
		}
	}, [transactionData]);

	return (
		<Modal
			title="View Transaction"
			className="Modal__hasFooter"
			footer={[<Button text="Close" onClick={onClose} />]}
			onCancel={onClose}
			visible
			centered
			closable
			width={400}
		>
			<Spin spinning={isTransactionFetching || isSiteSettingsFetching}>
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
										{formatInPeso(transactionData.gross_amount)}
									</Descriptions.Item>
									<Descriptions.Item
										label={`DISCOUNT | ${transactionData.discount_option.name}`}
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
								{formatInPeso(transactionData.invoice.vat_12_percent)}
							</Descriptions.Item>
							<Descriptions.Item label="ZERO Rated">
								{EMPTY_CELL}
							</Descriptions.Item>
						</Descriptions>

						<Space className="mt-6 w-100 justify-space-between">
							<Text>
								{formatDateTime(transactionData.invoice.datetime_created)}
							</Text>
							<Text>{transactionData.teller.employee_id}</Text>
						</Space>
						<Space className="w-100 justify-space-between">
							<Text>{transactionData.invoice.or_number}</Text>
							<Text>N2M1</Text>
							<Text>{dataSource.length} item(s)</Text>
						</Space>

						{discountOptionFields ? (
							<Descriptions
								colon={false}
								column={1}
								labelStyle={{
									width: 200,
									paddingLeft: 15,
								}}
								size="small"
							>
								{Object.keys(discountOptionFields).map((key) => (
									<Descriptions.Item key={key} label={key}>
										{discountOptionFields[key]}
									</Descriptions.Item>
								))}
							</Descriptions>
						) : (
							<Descriptions
								colon={false}
								column={1}
								labelStyle={{
									width: 200,
								}}
								size="small"
							>
								<Descriptions.Item label="Name">
									{transactionData.client?.name ||
										getFullName(transactionData.payment?.creditor_account) ||
										defaultClientName}
								</Descriptions.Item>
								<Descriptions.Item label="TIN">
									{transactionData.client?.tin ||
										transactionData.payment?.creditor_account?.tin ||
										EMPTY_CELL}
								</Descriptions.Item>
								<Descriptions.Item label="Address">
									{transactionData.client?.address ||
										transactionData.payment?.creditor_account?.home_address ||
										EMPTY_CELL}
								</Descriptions.Item>
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
		</Modal>
	);
};
