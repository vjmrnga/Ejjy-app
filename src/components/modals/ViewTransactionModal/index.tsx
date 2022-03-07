/* eslint-disable no-mixed-spaces-and-tabs */
import { Divider, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DetailsRow, DetailsSingle } from '../..';
import { EMPTY_CELL } from '../../../global/constants';
import { formatInPeso, formatQuantity } from '../../../utils/function';
import { Button } from '../../elements';
import './style.scss';

interface Props {
	transaction: any;
	onClose: any;
}

const columns: ColumnsType = [
	{ title: 'Item', dataIndex: 'item' },
	{ title: 'Quantity', dataIndex: 'quantity', align: 'center' },
	{ title: 'Rate', dataIndex: 'rate', align: 'right' },
	{ title: 'Amount', dataIndex: 'amount', align: 'right' },
];

export const ViewTransactionModal = ({ transaction, onClose }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// METHODS
	useEffect(() => {
		const formattedProducts = transaction?.products.map(
			({ branch_product, quantity, price_per_piece }) => ({
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
	}, [transaction]);

	return (
		<Modal
			title="View Transaction"
			className="ViewTransactionModal Modal__large Modal__hasFooter"
			footer={[<Button text="Close" onClick={onClose} />]}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<DetailsRow>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Location"
					value={transaction?.invoice?.location || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Proprietor"
					value={transaction?.invoice?.proprietor || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="TIN"
					value={transaction?.invoice?.tin || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Permit No."
					value={transaction?.invoice?.permit_number || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Machine ID"
					value={transaction?.branch_machine?.machine_id || EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Serial No (of printer)"
					value={
						transaction?.branch_machine?.machine_printer_serial_number ||
						EMPTY_CELL
					}
				/>
			</DetailsRow>

			<Divider />

			<h4 className="ViewTransaction_label">OFFICIAL RECEIPT</h4>

			<Divider />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ y: 300 }}
				pagination={false}
			/>

			<Divider />

			<DetailsRow>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Subtotal"
					value={formatInPeso(transaction?.total_amount)}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Amount Received"
					value={formatInPeso(transaction?.total_paid_amount)}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Amount Due"
					value={formatInPeso(transaction?.total_amount)}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="VAT Exempt"
					value={
						transaction?.invoice
							? formatInPeso(transaction?.invoice?.vat_exempt)
							: EMPTY_CELL
					}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="VAT Sales"
					value={
						transaction?.invoice
							? formatInPeso(transaction?.invoice?.vat_sales)
							: EMPTY_CELL
					}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="12% VAT"
					value={
						transaction?.invoice
							? formatInPeso(transaction?.invoice?.vat_12_percent)
							: EMPTY_CELL
					}
				/>
			</DetailsRow>

			<Divider />

			<DetailsRow>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Generated"
					value={
						transaction?.invoice?.datetime_created
							? moment(transaction?.invoice?.datetime_created).format(
									'YYYY-MM-DD',
							  )
							: EMPTY_CELL
					}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Cashier"
					value={
						transaction?.teller
							? `${transaction?.teller?.first_name} ${transaction?.teller?.last_name}`
							: EMPTY_CELL
					}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Total Transactions"
					value={transaction?.invoice?.total_transactions || EMPTY_CELL}
				/>
			</DetailsRow>

			<br />

			<DetailsRow>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Name"
					value={EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="TIN"
					value={EMPTY_CELL}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Address"
					value={EMPTY_CELL}
				/>
			</DetailsRow>

			<Divider />

			<DetailsRow>
				<DetailsSingle
					classNamesValue="ViewTransaction_value___center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.software_developer || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesValue="ViewTransaction_value___center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.software_developer_tin || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesValue="ViewTransaction_value___center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.pos_accreditation_number || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesValue="ViewTransaction_value___center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.pos_accreditation_date || EMPTY_CELL}
				/>
			</DetailsRow>
		</Modal>
	);
};
