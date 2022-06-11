import { Descriptions, Modal, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Button } from 'components/elements';
import { cashBreakdownCategories, cashBreakdownTypes } from 'global';
import React from 'react';
import { formatDateTime, formatInPeso, getFullName } from 'utils';

const columns: ColumnsType = [
	{
		title: 'Denom',
		dataIndex: 'denom',
		onCell: (data) => ({ colSpan: data.hasOwnProperty('subtotal') ? 1 : 3 }),
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
	const getCashBreakdownTypeDescription = (category, type) => {
		let description = '';

		if (category === cashBreakdownCategories.CASH_BREAKDOWN) {
			switch (type) {
				case cashBreakdownTypes.START_SESSION:
					description = 'Beginning Session';
					break;
				case cashBreakdownTypes.MID_SESSION:
					description = 'Cash Collection';
					break;
				case cashBreakdownTypes.END_SESSION:
					description = 'End Session';
					break;
				default:
					description = '';
			}
		} else if (category === cashBreakdownCategories.CASH_IN) {
			description = ' Cash In';
		} else if (category === cashBreakdownCategories.CASH_OUT) {
			description = ' Cash Out';
		}

		return description;
	};

	const type = getCashBreakdownTypeDescription(
		cashBreakdown.category,
		cashBreakdown.type,
	);

	return (
		<Modal
			title={`[View] ${type}`}
			className="Modal__hasFooter"
			footer={[<Button text="Close" onClick={onClose} />]}
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
					subtotal: 0.25 * cashBreakdown.coins_25,
				},
				{
					denom: '₱1.00',
					quantity: cashBreakdown.coins_1,
					amount: formatInPeso(cashBreakdown.coins_1),
					subtotal: cashBreakdown.coins_1,
				},
				{
					denom: '₱5.00',
					quantity: cashBreakdown.coins_5,
					amount: formatInPeso(5 * cashBreakdown.coins_5),
					subtotal: 5 * cashBreakdown.coins_5,
				},
				{
					denom: '₱10.00',
					quantity: cashBreakdown.coins_10,
					amount: formatInPeso(10 * cashBreakdown.coins_10),
					subtotal: 10 * cashBreakdown.coins_10,
				},
				{
					denom: '₱20.00',
					quantity: cashBreakdown.coins_20,
					amount: formatInPeso(20 * cashBreakdown.coins_20),
					subtotal: 20 * cashBreakdown.coins_20,
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
					subtotal: 20 * cashBreakdown.bills_20,
				},
				{
					denom: '₱50.00',
					quantity: cashBreakdown.bills_50,
					amount: formatInPeso(50 * cashBreakdown.bills_50),
					subtotal: 50 * cashBreakdown.bills_50,
				},
				{
					denom: '₱100.00',
					quantity: cashBreakdown.bills_100,
					amount: formatInPeso(100 * cashBreakdown.bills_100),
					subtotal: 100 * cashBreakdown.bills_100,
				},
				{
					denom: '₱200.00',
					quantity: cashBreakdown.bills_200,
					amount: formatInPeso(200 * cashBreakdown.bills_200),
					subtotal: 200 * cashBreakdown.bills_200,
				},
				{
					denom: '₱500.00',
					quantity: cashBreakdown.bills_500,
					amount: formatInPeso(500 * cashBreakdown.bills_500),
					subtotal: 500 * cashBreakdown.bills_500,
				},
				{
					denom: '₱1,000.00',
					quantity: cashBreakdown.bills_1000,
					amount: formatInPeso(1000 * cashBreakdown.bills_1000),
					subtotal: 1000 * cashBreakdown.bills_1000,
				},
			]}
			summary={(pageData) => {
				const total = pageData.reduce(
					(prev, current: any) => prev + (current?.subtotal || 0),
					0,
				);

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
