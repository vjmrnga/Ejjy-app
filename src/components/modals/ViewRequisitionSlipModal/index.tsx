import { FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Col, Descriptions, Modal, Row } from 'antd';
import { ReceiptHeader } from 'components/Receipt';
import { printRequisitionSlip } from 'configurePrinter';
import dayjs from 'dayjs';
import { JSPDF_SETTINGS } from 'global';
import { useSiteSettingsRetrieve } from 'hooks';
import jsPDF from 'jspdf';
import React, { useState } from 'react';
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
	// STATES
	const [isCreatingPdf, setIsCreatingPdf] = useState(false);
	const [html, setHtml] = useState('');

	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const { data: siteSettings } = useSiteSettingsRetrieve();

	// METHODS
	const handlePrint = () => {
		printRequisitionSlip({ requisitionSlip, siteSettings, user });
	};

	const handleCreatePdf = () => {
		setIsCreatingPdf(true);

		// eslint-disable-next-line new-cap
		const pdf = new jsPDF(JSPDF_SETTINGS);

		const dataHtml = printRequisitionSlip({
			requisitionSlip,
			siteSettings,
			user,
			isPdf: true,
		});

		setHtml(dataHtml);

		setTimeout(() => {
			pdf.html(dataHtml, {
				margin: 10,
				filename: `RequisitionSlip_${requisitionSlip.id}`,
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
			className="Modal__hasFooter"
			footer={[
				<Button
					key="print"
					disabled={isCreatingPdf}
					icon={<PrinterOutlined />}
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
					type="primary"
					onClick={handleCreatePdf}
				>
					Create PDF
				</Button>,
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
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>
		</Modal>
	);
};
