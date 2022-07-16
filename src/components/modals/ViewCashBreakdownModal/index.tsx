import { FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { printCashBreakdown, printCashOut } from 'configurePrinter';
import { cashBreakdownCategories } from 'global';
import { useSiteSettingsRetrieve } from 'hooks';
import jsPDF from 'jspdf';
import React, { useState } from 'react';
import {
	calculateCashBreakdownTotal,
	formatDateTime,
	formatInPeso,
	getCashBreakdownTypeDescription,
	getFullName,
} from 'utils';

const columns: ColumnsType = [
	{
		title: 'Denom',
		dataIndex: 'denom',
		onCell: (data) => ({ colSpan: data.hasOwnProperty('amount') ? 1 : 3 }),
	},
	{
		title: 'Qty',
		dataIndex: 'quantity',
		align: 'center',
		onCell: (data) => ({ colSpan: data.hasOwnProperty('quantity') ? 1 : 0 }),
	},
	{
		title: 'Amount',
		dataIndex: 'amount',
		align: 'right',
		onCell: (data) => ({ colSpan: data.hasOwnProperty('amount') ? 1 : 0 }),
	},
];

interface Props {
	cashBreakdown: any | number;
	onClose: any;
}

export const ViewCashBreakdownModal = ({ cashBreakdown, onClose }: Props) => {
	// VARIABLES
	const type = getCashBreakdownTypeDescription(
		cashBreakdown.category,
		cashBreakdown.type,
	);

	// STATES
	const [isCreatingPdf, setIsCreatingPdf] = useState(false);
	const [html, setHtml] = useState('');

	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettingsRetrieve();

	// METHODS
	const handlePrint = () => {
		if (cashBreakdown.category === cashBreakdownCategories.CASH_OUT) {
			printCashOut(cashBreakdown);
		} else {
			printCashBreakdown({ cashBreakdown, siteSettings });
		}
	};

	const handleCreatePdf = () => {
		setIsCreatingPdf(true);

		// eslint-disable-next-line new-cap
		const pdf = new jsPDF({
			orientation: 'p',
			unit: 'px',
			format: 'legal',
			hotfixes: ['px_scaling'],
		});

		let dataHtml;
		if (cashBreakdown.category === cashBreakdownCategories.CASH_OUT) {
			dataHtml = printCashOut({ cashOut: cashBreakdown, isPdf: true });
		} else {
			dataHtml = printCashBreakdown({
				cashBreakdown,
				siteSettings,
				isPdf: true,
			});
		}

		setHtml(dataHtml);

		const fileName =
			cashBreakdown.category === cashBreakdownCategories.CASH_OUT
				? 'CashOut'
				: 'CashBreakdown';
		setTimeout(() => {
			pdf.html(dataHtml, {
				margin: 10,
				filename: `${fileName}_${cashBreakdown.id}`,
				callback: (instance) => {
					window.open(instance.output('bloburl').toString());
					setIsCreatingPdf(false);
					setHtml('');
				},
			});
		}, 2000);
	};

	return (
		<Modal
			title={`[View] ${type}`}
			className="Modal__hasFooter"
			footer={[
				<Button
					key="print"
					disabled={isCreatingPdf}
					icon={<PrinterOutlined />}
					size="large"
					type="primary"
					onClick={handlePrint}
				>
					Print
				</Button>,
				<Button
					key="pdf"
					disabled={isCreatingPdf}
					icon={<FilePdfOutlined />}
					loading={isCreatingPdf}
					size="large"
					type="primary"
					onClick={handleCreatePdf}
				>
					Create PDF
				</Button>,
			]}
			onCancel={onClose}
			visible
			centered
			closable
		>
			{cashBreakdown.category === cashBreakdownCategories.CASH_OUT ? (
				<CashOutDetails cashBreakdown={cashBreakdown} />
			) : (
				<CashBreakdownDetails cashBreakdown={cashBreakdown} type={type} />
			)}

			<div
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>
		</Modal>
	);
};

const CashOutDetails = ({ cashBreakdown }) => {
	const cashOut = cashBreakdown.cash_out_metadata;

	return (
		<>
			<Descriptions
				labelStyle={{ width: 200 }}
				bordered
				className="w-100"
				column={1}
			>
				<Descriptions.Item label="Datetime">
					{formatDateTime(cashBreakdown.datetime_created)}
				</Descriptions.Item>
				<Descriptions.Item label="Payee">{cashOut.payee}</Descriptions.Item>
				<Descriptions.Item label="Particulars">
					{cashOut.particulars}
				</Descriptions.Item>
				<Descriptions.Item label="Amount">
					{formatInPeso(cashOut.amount)}
				</Descriptions.Item>
				<Descriptions.Item label="Prepared By">
					{getFullName(cashOut.prepared_by_user)}
				</Descriptions.Item>
				<Descriptions.Item label="Approved By">
					{getFullName(cashOut.approved_by_user)}
				</Descriptions.Item>
				<Descriptions.Item label="Received By">
					{cashOut.received_by}
				</Descriptions.Item>
			</Descriptions>
		</>
	);
};

const CashBreakdownDetails = ({ cashBreakdown, type }) => (
	<>
		<Descriptions
			labelStyle={{ width: 200 }}
			bordered
			className="w-100"
			column={1}
		>
			<Descriptions.Item label="Datetime Created">
				{formatDateTime(cashBreakdown.datetime_created)}
			</Descriptions.Item>
			<Descriptions.Item label="Branch Machine">
				{cashBreakdown.branch_machine.name}
			</Descriptions.Item>
			<Descriptions.Item label="Cashier">
				{getFullName(cashBreakdown.cashiering_session.user)}
			</Descriptions.Item>
			<Descriptions.Item label="Type">{type}</Descriptions.Item>
			{cashBreakdown.category === cashBreakdownCategories.CASH_IN && (
				<Descriptions.Item label="Remarks">
					{cashBreakdown.remarks}
				</Descriptions.Item>
			)}
		</Descriptions>

		<Table
			rowKey="denom"
			className="mt-6"
			columns={columns}
			dataSource={[
				{
					denom: (
						<Typography.Title className="ma-0" level={5}>
							COINS
						</Typography.Title>
					),
				},
				{
					denom: '₱0.25',
					quantity: cashBreakdown.coins_25,
					amount: formatInPeso(0.25 * cashBreakdown.coins_25),
				},
				{
					denom: '₱1.00',
					quantity: cashBreakdown.coins_1,
					amount: formatInPeso(cashBreakdown.coins_1),
				},
				{
					denom: '₱5.00',
					quantity: cashBreakdown.coins_5,
					amount: formatInPeso(5 * cashBreakdown.coins_5),
				},
				{
					denom: '₱10.00',
					quantity: cashBreakdown.coins_10,
					amount: formatInPeso(10 * cashBreakdown.coins_10),
				},
				{
					denom: '₱20.00',
					quantity: cashBreakdown.coins_20,
					amount: formatInPeso(20 * cashBreakdown.coins_20),
				},
				{
					denom: (
						<Typography.Title className="ma-0" level={5}>
							BILLS
						</Typography.Title>
					),
				},
				{
					denom: '₱20.00',
					quantity: cashBreakdown.bills_20,
					amount: formatInPeso(20 * cashBreakdown.bills_20),
				},
				{
					denom: '₱50.00',
					quantity: cashBreakdown.bills_50,
					amount: formatInPeso(50 * cashBreakdown.bills_50),
				},
				{
					denom: '₱100.00',
					quantity: cashBreakdown.bills_100,
					amount: formatInPeso(100 * cashBreakdown.bills_100),
				},
				{
					denom: '₱200.00',
					quantity: cashBreakdown.bills_200,
					amount: formatInPeso(200 * cashBreakdown.bills_200),
				},
				{
					denom: '₱500.00',
					quantity: cashBreakdown.bills_500,
					amount: formatInPeso(500 * cashBreakdown.bills_500),
				},
				{
					denom: '₱1,000.00',
					quantity: cashBreakdown.bills_1000,
					amount: formatInPeso(1000 * cashBreakdown.bills_1000),
				},
			]}
			summary={() => {
				const total = calculateCashBreakdownTotal(cashBreakdown);

				return (
					<>
						<Table.Summary.Row>
							<Table.Summary.Cell index={0}>
								<Typography.Title className="ma-0" level={4}>
									Total
								</Typography.Title>
							</Table.Summary.Cell>
							<Table.Summary.Cell index={1} colSpan={2} align="right">
								<Typography.Title className="ma-0" level={4}>
									{formatInPeso(total)}
								</Typography.Title>
							</Table.Summary.Cell>
						</Table.Summary.Row>
					</>
				);
			}}
			pagination={false}
			bordered
		/>
	</>
);
