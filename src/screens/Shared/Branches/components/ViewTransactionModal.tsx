/* eslint-disable no-mixed-spaces-and-tabs */
import { Divider, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DetailsRow, DetailsSingle } from '../../../../components';
import { EMPTY_CELL } from '../../../../global/constants';
import { formatBalance, numberWithCommas } from '../../../../utils/function';

interface Props {
	transaction: any;
	visible: boolean;
	onClose: any;
}

const columns: ColumnsType = [
	{ title: 'Item', dataIndex: 'item', key: 'item' },
	{ title: 'Qty', dataIndex: 'qty', key: 'qty' },
	{ title: 'Rate', dataIndex: 'rate', key: 'rate' },
	{ title: 'Amount', dataIndex: 'amount', key: 'amount' },
];

export const ViewTransactionModal = ({
	transaction,
	visible,
	onClose,
}: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// METHODS
	useEffect(() => {
		setData(
			transaction?.products.map(
				({ branch_product, quantity, price_per_piece }) => ({
					item: branch_product.product.name,
					qty: formatBalance(
						branch_product.product.unit_of_measurement,
						quantity,
					),
					rate: `₱${numberWithCommas(Number(price_per_piece).toFixed(2))}`,
					amount: `₱${numberWithCommas(
						(quantity * Number(price_per_piece)).toFixed(2),
					)}`,
				}),
			),
		);
	}, [transaction]);

	return (
		<Modal
			title="View Transaction"
			className="ViewTransactionModal ModalLarge"
			visible={visible}
			footer={null}
			onCancel={onClose}
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

			<h4 className="official-receipt-label">OFFICIAL RECEIPT</h4>

			<Divider />

			<Table
				columns={columns}
				dataSource={data}
				scroll={{ y: 300 }}
				pagination={false}
			/>

			<Divider />

			<DetailsRow>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Subtotal"
					value={`₱${numberWithCommas(
						Number(transaction?.total_amount).toFixed(2),
					)}`}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Amount Received"
					value={`₱${numberWithCommas(
						Number(transaction?.total_paid_amount).toFixed(2),
					)}`}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="Amount Due"
					value={`₱${numberWithCommas(
						Number(transaction?.total_amount).toFixed(2),
					)}`}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="VAT Exempt"
					value={
						transaction?.invoice
							? `₱${numberWithCommas(
									Number(transaction?.invoice?.vat_exempt).toFixed(2),
							  )}`
							: EMPTY_CELL
					}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="VAT Sales"
					value={
						transaction?.invoice
							? `₱${numberWithCommas(
									Number(transaction?.invoice?.vat_sales).toFixed(2),
							  )}`
							: EMPTY_CELL
					}
				/>
				<DetailsSingle
					labelSpan={8}
					valueSpan={16}
					label="12% VAT"
					value={
						transaction?.invoice
							? `₱${numberWithCommas(
									Number(transaction?.invoice?.vat_12_percent).toFixed(2),
							  )}`
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
					classNamesValue="value-center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.software_developer || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesValue="value-center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.software_developer_tin || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesValue="value-center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.pos_accreditation_number || EMPTY_CELL}
				/>
				<DetailsSingle
					classNamesValue="value-center"
					labelSpan={0}
					valueSpan={24}
					label=""
					value={transaction?.invoice?.pos_accreditation_date || EMPTY_CELL}
				/>
			</DetailsRow>
		</Modal>
	);
};
