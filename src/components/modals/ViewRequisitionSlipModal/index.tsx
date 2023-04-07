import { PrinterOutlined } from '@ant-design/icons';
import { Button, Col, Descriptions, Modal, Row } from 'antd';
import { PdfButtons, ReceiptHeader } from 'components/Printing';
import { printRequisitionSlip } from 'configurePrinter';
import dayjs from 'dayjs';
import { usePdf, useSiteSettings } from 'hooks';
import React from 'react';
import { useUserStore } from 'stores';
import {
	formatDateTime,
	formatQuantity,
	getFullName,
	getRequestor,
} from 'utils';

interface Props {
	requisitionSlip: any;
	onClose: any;
}

export const ViewRequisitionSlipModal = ({
	requisitionSlip,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const { data: siteSettings } = useSiteSettings();
	const { htmlPdf, isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		title: `RequisitionSlip_${requisitionSlip.id}.pdf`,
		print: () =>
			printRequisitionSlip({
				requisitionSlip,
				siteSettings,
				user,
				isPdf: true,
			}),
	});

	// METHODS
	const handlePrint = () => {
		printRequisitionSlip({ requisitionSlip, siteSettings, user });
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
			title="Requisition Slip"
			width={425}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<ReceiptHeader title="REQUISITION SLIP" />

			<Descriptions
				className="mt-6 w-100"
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
				<Descriptions.Item label="Date & Time Requested">
					{formatDateTime(requisitionSlip.datetime_created)}
				</Descriptions.Item>
				<Descriptions.Item label="Requestor">
					{getRequestor(requisitionSlip)}
				</Descriptions.Item>
				<Descriptions.Item label="F-RS1">
					{requisitionSlip.id}
				</Descriptions.Item>
			</Descriptions>

			<div className="mt-6">
				{requisitionSlip.products.map(({ quantity_piece, product }) => (
					<Row key={product.name} gutter={[0, 0]}>
						<Col span={24}>{product.name}</Col>
						<Col className="pl-4" span={12}>
							{formatQuantity({
								unitOfMeasurement: product.unit_of_measurement,
								quantity: quantity_piece,
							})}
						</Col>
						<Col span={12}>-</Col>
					</Row>
				))}
			</div>

			<Descriptions
				className="mt-6 w-100"
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
				<Descriptions.Item label="Date & Time Printed">
					{dayjs().format('MM/DD/YYYY h:mmA')}
				</Descriptions.Item>
				<Descriptions.Item label="Printed By">
					{getFullName(user)}
				</Descriptions.Item>
			</Descriptions>

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: htmlPdf }}
				style={{ display: 'none' }}
			/>
		</Modal>
	);
};
