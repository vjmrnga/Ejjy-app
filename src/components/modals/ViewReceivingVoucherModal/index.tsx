import { PrinterOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PdfButtons, ReceiptFooter, ReceiptHeader } from 'components/Printing';
import { printReceivingVoucherForm } from 'configurePrinter';
import { vatTypes, VIEW_PRINTING_MODAL_WIDTH } from 'global';
import { usePdf, useSiteSettings } from 'hooks';
import React, { useEffect, useState } from 'react';
import { formatDateTime, formatInPeso, formatQuantity } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Qty', dataIndex: 'qty', align: 'center' },
	{ title: 'Cost', dataIndex: 'rate', align: 'center' },
	{ title: 'Subtotal', dataIndex: 'subtotal', align: 'center' },
];

interface Props {
	receivingVoucher: any;
	onClose: any;
}

export const ViewReceivingVoucherModal = ({
	receivingVoucher,
	onClose,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettings();
	const { htmlPdf, isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		title: `ReceivingVoucher_${receivingVoucher.id}.pdf`,
		print: () =>
			printReceivingVoucherForm({
				receivingVoucher,
				siteSettings,
				isPdf: true,
			}),
	});

	// METHODS
	useEffect(() => {
		const products = receivingVoucher?.products || [];

		const formattedProducts = products.map((item) => ({
			key: item.id,
			name: `${item.product.name} - ${
				item.product.is_vat_exempted ? vatTypes.VAT_EMPTY : vatTypes.VATABLE
			}`,

			qty: formatQuantity({
				unitOfMeasurement: item.product.unit_of_measurement,
				quantity: item.quantity,
			}),
			rate: formatInPeso(item.cost_per_piece),
			subtotal: formatInPeso(item.quantity * item.cost_per_piece),
		}));

		setDataSource(formattedProducts);
	}, [receivingVoucher]);

	const handlePrint = () => {
		printReceivingVoucherForm({ receivingVoucher, siteSettings });
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
			title="[View] Receiving Voucher"
			width={VIEW_PRINTING_MODAL_WIDTH}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<ReceiptHeader title="RECEIVING VOUCHER" />

			<Table
				className="mt-6"
				columns={columns}
				dataSource={dataSource}
				pagination={false}
				size="small"
				bordered
			/>
			<Space className="w-100 mt-2 justify-space-between">
				<Typography.Text>TOTAL AMOUNT PAID</Typography.Text>
				<Typography.Text strong>
					{formatInPeso(receivingVoucher.amount_paid)}
				</Typography.Text>
			</Space>

			<Space className="mt-4 w-100">
				<Typography.Text>
					{formatDateTime(receivingVoucher.datetime_created)}
				</Typography.Text>
			</Space>
			<Space className="w-100 justify-space-between">
				<Typography.Text>
					C: {receivingVoucher.checked_by.employee_id}
				</Typography.Text>
				<Typography.Text>
					E: {receivingVoucher.encoded_by.employee_id}
				</Typography.Text>
			</Space>
			<Space className="w-100">
				<Typography.Text>
					Supplier: {receivingVoucher.supplier_name}
				</Typography.Text>
			</Space>

			<ReceiptFooter />

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: htmlPdf }}
				style={{ display: 'none' }}
			/>
		</Modal>
	);
};
