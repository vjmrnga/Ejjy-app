import {
	FilePdfOutlined,
	FileTextOutlined,
	PrinterOutlined,
} from '@ant-design/icons';
import { Button, Descriptions, Modal, Space, Typography } from 'antd';
import { ReceiptFooter, ReceiptHeader } from 'components/Receipt';
import { printZReadReport } from 'configurePrinter';
import { createZReadTxt } from 'configureTxt';
import dayjs from 'dayjs';
import { EMPTY_CELL, JSPDF_SETTINGS, taxTypes } from 'global';
import { useSiteSettingsRetrieve } from 'hooks';
import jsPDF from 'jspdf';
import React, { useState } from 'react';
import { formatDate, formatInPeso } from 'utils';

const { Text } = Typography;

interface Props {
	report: any;
	onClose: any;
}

export const ViewZReadReportModal = ({ report, onClose }: Props) => {
	// STATES
	const [isCreatingPdf, setIsCreatingPdf] = useState(false);
	const [isCreatingTxt, setIsCreatingTxt] = useState(false);
	const [html, setHtml] = useState('');

	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettingsRetrieve();

	// METHODS
	const handlePrint = () => {
		printZReadReport({ report, siteSettings });
	};

	const handleCreatePdf = () => {
		setIsCreatingPdf(true);

		// eslint-disable-next-line new-cap
		const pdf = new jsPDF(JSPDF_SETTINGS);

		const dataHtml = printZReadReport({ report, siteSettings, isPdf: true });

		setHtml(dataHtml);

		setTimeout(() => {
			pdf.html(dataHtml, {
				margin: 10,
				filename: `ZReadReport_${report.id}`,
				callback: (instance) => {
					window.open(instance.output('bloburl').toString());
					setIsCreatingPdf(false);
					setHtml('');
				},
			});
		}, 2000);
	};

	const handleCreateTxt = () => {
		setIsCreatingTxt(true);
		createZReadTxt({ report, siteSettings });
		setIsCreatingTxt(false);
	};

	return (
		<Modal
			className="Modal__hasFooter"
			footer={[
				<Button
					key="print"
					disabled={isCreatingPdf || isCreatingTxt}
					icon={<PrinterOutlined />}
					size="large"
					type="primary"
					onClick={handlePrint}
				>
					Print
				</Button>,
				<Button
					key="pdf"
					disabled={isCreatingPdf || isCreatingTxt}
					icon={<FilePdfOutlined />}
					loading={isCreatingPdf}
					size="large"
					type="primary"
					onClick={handleCreatePdf}
				>
					Create PDF
				</Button>,
				<Button
					key="txt"
					disabled={isCreatingPdf || isCreatingTxt}
					icon={<FileTextOutlined />}
					loading={isCreatingTxt}
					size="large"
					type="primary"
					onClick={handleCreateTxt}
				>
					Create TXT
				</Button>,
			]}
			title="Z-Read Report"
			width={425}
			centered
			closable
			visible
			onCancel={onClose}
		>
			{report?.branch_machine && (
				<ReceiptHeader branchMachine={report.branch_machine} />
			)}

			<Space align="center" className="mt-6 w-100 justify-space-between">
				<Text>Z-READ</Text>
				<Text>{`For ${formatDate(report.date)}`}</Text>
			</Space>

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
				<Descriptions.Item label="CASH SALES">
					{formatInPeso(report.cash_sales)}&nbsp;
				</Descriptions.Item>
				<Descriptions.Item label="CREDIT SALES">
					{formatInPeso(report.credit_pay)}&nbsp;
				</Descriptions.Item>
				<Descriptions.Item label="GROSS SALES">
					{formatInPeso(report.gross_sales)}&nbsp;
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
					{formatInPeso(report.vat_exempt)}&nbsp;
				</Descriptions.Item>
				{siteSettings.tax_type === taxTypes.VAT && (
					<>
						<Descriptions.Item label="VATable Sales">
							{formatInPeso(report.vat_sales)}&nbsp;
						</Descriptions.Item>
						<Descriptions.Item label="VAT Amount">
							{formatInPeso(report.vat_amount)}&nbsp;
						</Descriptions.Item>
					</>
				)}
				<Descriptions.Item label="ZERO Rated">
					{formatInPeso(0)}&nbsp;
				</Descriptions.Item>
			</Descriptions>

			<div className="w-100" style={{ textAlign: 'right' }}>
				----------------
			</div>

			<Descriptions
				className="w-100"
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
				<Descriptions.Item label="GROSS SALES">
					{formatInPeso(report.gross_sales)}&nbsp;
				</Descriptions.Item>
				<Descriptions.Item
					label="REG. DISCOUNT"
					labelStyle={{ paddingLeft: 30 }}
				>
					({formatInPeso(report.regular_discount)})
				</Descriptions.Item>
				<Descriptions.Item
					label="SPECIAL DISCOUNT"
					labelStyle={{ paddingLeft: 30 }}
				>
					({formatInPeso(report.special_discount)})
				</Descriptions.Item>
				<Descriptions.Item
					label="VOIDED SALES"
					labelStyle={{ paddingLeft: 30 }}
				>
					({formatInPeso(report.void)})
				</Descriptions.Item>
				{siteSettings.tax_type === taxTypes.VAT && (
					<>
						<Descriptions.Item
							label="VAT Amount"
							labelStyle={{ paddingLeft: 30 }}
						>
							({formatInPeso(report.vat_amount)})
						</Descriptions.Item>
					</>
				)}
				<Descriptions.Item
					contentStyle={{ fontWeight: 'bold' }}
					label="NET SALES"
					labelStyle={{ fontWeight: 'bold' }}
				>
					{formatInPeso(report.net_sales)}&nbsp;
				</Descriptions.Item>
			</Descriptions>

			{siteSettings.tax_type === taxTypes.VAT && (
				<>
					<div className="w-100" style={{ textAlign: 'right' }}>
						----------------
					</div>

					<Descriptions
						className="w-100"
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
						<Descriptions.Item label="ADJUSTMENT ON VAT">
							{null}
						</Descriptions.Item>
						<Descriptions.Item
							label="SPECIAL DISCOUNT"
							labelStyle={{ paddingLeft: 30 }}
						>
							{formatInPeso(report.vat_special_discount)}&nbsp;
						</Descriptions.Item>
						<Descriptions.Item label="OTHERS" labelStyle={{ paddingLeft: 30 }}>
							{formatInPeso(report.others)}&nbsp;
						</Descriptions.Item>
						<Descriptions.Item label="TOTAL" labelStyle={{ paddingLeft: 30 }}>
							{formatInPeso(report.total_vat_adjusted)}&nbsp;
						</Descriptions.Item>
					</Descriptions>

					<div className="w-100" style={{ textAlign: 'right' }}>
						----------------
					</div>

					<Descriptions
						className="w-100"
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
						<Descriptions.Item label="VAT AMOUNT">
							{formatInPeso(report.vat_amount)}&nbsp;
						</Descriptions.Item>
						<Descriptions.Item label="VAT ADJ.">
							({formatInPeso(report.total_vat_adjusted)})
						</Descriptions.Item>
						<Descriptions.Item label="VAT PAYABLE">
							{formatInPeso(report.vat_payable)}
							&nbsp;
						</Descriptions.Item>
					</Descriptions>
				</>
			)}

			<Space className="mt-6 w-100 justify-space-between">
				<Text>{dayjs().format('MM/DD/YYYY h:mmA')}</Text>
				<Text>{report.generated_by.employee_id || EMPTY_CELL}</Text>
			</Space>

			<Text className="w-100 text-center d-block">
				End SI #: {report.ending_or?.or_number || EMPTY_CELL}
			</Text>

			<ReceiptFooter />

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>
		</Modal>
	);
};
