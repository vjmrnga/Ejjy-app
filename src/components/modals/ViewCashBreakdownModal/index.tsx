/* eslint-disable no-prototype-builtins */
import { PrinterOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PdfButtons } from 'components/Printing';
import dayjs from 'dayjs';
import { getFullName, printCashBreakdown, printCashOut } from 'ejjy-global';
import { cashBreakdownCategories } from 'global';
import { usePdf, useSiteSettings } from 'hooks';
import React from 'react';
import {
	formatDateTime,
	formatInPeso,
	getCashBreakdownTypeDescription,
} from 'utils';

const { Text } = Typography;

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
	const session = cashBreakdown.cashiering_session;

	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettings();
	const { htmlPdf, isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		title: `${
			cashBreakdown.category === cashBreakdownCategories.CASH_OUT
				? 'CashOut'
				: 'CashBreakdown'
		}_${cashBreakdown.id}.pdf`,
		print: () => {
			if (cashBreakdown.category === cashBreakdownCategories.CASH_OUT) {
				return printCashOut(cashBreakdown, siteSettings, true);
			}

			return printCashBreakdown(cashBreakdown, siteSettings, true);
		},
	});

	// METHODS
	const handlePrint = () => {
		if (cashBreakdown.category === cashBreakdownCategories.CASH_OUT) {
			printCashOut(cashBreakdown, siteSettings);
		} else {
			printCashBreakdown(cashBreakdown, siteSettings);
		}
	};

	return (
		<Modal
			className="Modal__hasFooter"
			footer={[
				<Button
					key="print"
					disabled={isLoadingPdf}
					icon={<PrinterOutlined />}
					type="primary"
					onClick={handlePrint}
				>
					Print
				</Button>,
				<PdfButtons
					key="pdf"
					downloadPdf={downloadPdf}
					isDisabled={isLoadingPdf}
					isLoading={isLoadingPdf}
					previewPdf={previewPdf}
				/>,
			]}
			title={`[View] ${type}`}
			centered
			closable
			open
			onCancel={onClose}
		>
			{cashBreakdown.category === cashBreakdownCategories.CASH_OUT ? (
				<CashOutDetails cashBreakdown={cashBreakdown} />
			) : (
				<CashBreakdownDetails cashBreakdown={cashBreakdown} type={type} />
			)}

			<Space className="mt-6 w-100" direction="vertical">
				<Text>GDT: {formatDateTime(cashBreakdown.datetime_created)}</Text>
				<Text>PDT: {formatDateTime(dayjs(), false)}</Text>
				<Text>{session?.user.employee_id}</Text>
			</Space>

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: htmlPdf }}
				style={{ display: 'none' }}
			/>
		</Modal>
	);
};

const CashOutDetails = ({ cashBreakdown }) => {
	const cashOut = cashBreakdown.cash_out_metadata;

	return (
		<Descriptions
			className="w-100"
			column={1}
			labelStyle={{ width: 200 }}
			bordered
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
	);
};

const CashBreakdownDetails = ({ cashBreakdown, type }) => (
	<>
		<Descriptions
			className="w-100"
			column={1}
			labelStyle={{ width: 200 }}
			bordered
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
			className="mt-6"
			columns={columns}
			dataSource={[
				{
					key: 'divider_coins',
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
					key: 'divider_bills',
					denom: (
						<Typography.Title className="ma-0" level={5}>
							BILLS
						</Typography.Title>
					),
				},
				{
					key: '₱20.00_bill',
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
			pagination={false}
			rowKey={(record: any) => record?.key || record.denom}
			summary={() => (
				<>
					<Table.Summary.Row>
						<Table.Summary.Cell index={0}>
							<Typography.Title className="ma-0" level={4}>
								Total
							</Typography.Title>
						</Table.Summary.Cell>
						<Table.Summary.Cell align="right" colSpan={2} index={1}>
							<Typography.Title className="ma-0" level={4}>
								{formatInPeso(cashBreakdown.total_amount)}
							</Typography.Title>
						</Table.Summary.Cell>
					</Table.Summary.Row>
				</>
			)}
			bordered
		/>
	</>
);
