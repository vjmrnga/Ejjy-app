/* eslint-disable no-mixed-spaces-and-tabs */
import {
	Descriptions,
	Divider,
	Modal,
	Space,
	Spin,
	Table,
	Typography,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Button } from 'components/elements';
import { EMPTY_CELL, saleTypes } from 'global';
import { useSiteSettingsRetrieve, useTransactionRetrieve } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { formatDateTime, formatInPeso, formatQuantity } from 'utils/function';

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
		const products =
			transaction?.products || transactionRetrieved?.products || [];

		const formattedProducts = products.map(
			({ id, branch_product, quantity, price_per_piece }) => ({
				key: id,
				item: branch_product.product.name,
				quantity: formatQuantity(
					branch_product.product.unit_of_measurement,
					quantity,
				),
				rate: formatInPeso(price_per_piece),
				amount: formatInPeso(quantity * Number(price_per_piece)),
			}),
		);

		setDataSource(formattedProducts);
	}, [transaction, transactionRetrieved]);

	useEffect(() => {
		setTransactionData(
			_.isNumber(transaction) ? transactionRetrieved : transaction,
		);
	}, [transactionRetrieved, transaction]);

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
			title={`View Transaction - ${title}`}
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
						<Space
							align="center"
							className="w-100 text-center"
							direction="vertical"
							size={0}
						>
							<Title level={3}>EJY AND JY</Title>
							<Text>WET MARKET AND ENTERPRISES</Text>
							<Text>POB., CARMEN, AGUSAN DEL NORTE</Text>
							<Text>Tel#: 080-8866</Text>
							<Text>{transactionData.invoice.proprietor}</Text>
							<Text>{transactionData.invoice.location}</Text>
							<Text>
								{siteSettings.tax_type} | {transactionData.invoice.tin}
							</Text>
							<Text>Machine ID Number</Text>
							<Text>Software License Number</Text>
							<Text>[{title}]</Text>
						</Space>

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
								{formatInPeso(
									transactionData.overall_discount > 0
										? transactionData.invoice.vat_exempt_discount
										: transactionData.invoice.vat_exempt,
								)}
							</Descriptions.Item>
							<Descriptions.Item label="VAT Sales">
								{formatInPeso(
									transactionData.overall_discount > 0
										? transactionData.invoice.vat_sales_discount
										: transactionData.invoice.vat_sales,
								)}
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

						{['PWD', 'SC'].includes(transactionData?.discount_option?.name) ? (
							<Descriptions
								colon={false}
								column={1}
								labelStyle={{
									width: 200,
									paddingLeft: 15,
								}}
								size="small"
							>
								<Descriptions.Item label="TIN">{EMPTY_CELL}</Descriptions.Item>
								<Descriptions.Item label="ID#">{EMPTY_CELL}</Descriptions.Item>
								<Descriptions.Item label="Signature">
									{EMPTY_CELL}
								</Descriptions.Item>
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
									{transactionData.client?.name || defaultClientName}
								</Descriptions.Item>
								<Descriptions.Item label="TIN">
									{transactionData.client?.tin || EMPTY_CELL}
								</Descriptions.Item>
								<Descriptions.Item label="Address">
									{transactionData.client?.address || EMPTY_CELL}
								</Descriptions.Item>
							</Descriptions>
						)}

						<Space
							align="center"
							className="mt-8 w-100 text-center"
							direction="vertical"
							size={0}
						>
							<Text>{siteSettings.software_developer}</Text>
							<Text>Burgos St., Poblacion, Carmen,</Text>
							<Text>Agusan del Norte</Text>
							<Text>{siteSettings.software_developer_tin}</Text>
							<Text>{siteSettings.pos_accreditation_number}</Text>
							<Text>{siteSettings.pos_accreditation_date}</Text>
							<Text>{siteSettings.pos_accreditation_valid_until_date}</Text>

							<Text className="mt-4 d-block">
								THIS INVOICE SHALL BE VALID FOR FIVE (5) YEARS FROM THE DATE OF
								PERMIT TO USE.
							</Text>
							<Text>THIS SERVES AS YOUR SALES INVOICE</Text>
							<Text>&quot;{siteSettings.thank_you_message}&quot;</Text>
						</Space>
					</>
				)}
			</Spin>
		</Modal>
	);
};
