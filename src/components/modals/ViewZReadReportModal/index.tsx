import { FileTextOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Space, Typography } from 'antd';
import { PdfButtons, ReceiptFooter, ReceiptHeader } from 'components/Printing';
import { printZReadReport } from 'configurePrinter';
import { createZReadTxt } from 'configureTxt';
import dayjs from 'dayjs';
import { EMPTY_CELL, taxTypes } from 'global';
import { usePdf, useSiteSettings } from 'hooks';
import React, { useState } from 'react';
import { formatDate, formatInPeso } from 'utils';

const { Text } = Typography;

interface Props {
	report: any;
	onClose: any;
}

export const ViewZReadReportModal = ({ report, onClose }: Props) => {
	// STATES
	const [isCreatingTxt, setIsCreatingTxt] = useState(false);

	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettings();
	const { htmlPdf, isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		title: `ZReadReport_${report.id}.pdf`,
		print: () => printZReadReport({ report, siteSettings, isPdf: true }),
	});

	// METHODS
	const handlePrint = () => {
		printZReadReport({ report, siteSettings });
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
					key="receipt"
					disabled={isLoadingPdf || isCreatingTxt}
					icon={<PrinterOutlined />}
					type="primary"
					onClick={handlePrint}
				>
					Print
				</Button>,
				<PdfButtons
					key="pdf"
					downloadPdf={downloadPdf}
					isDisabled={isLoadingPdf || isCreatingTxt}
					isLoading={isLoadingPdf}
					previewPdf={previewPdf}
				/>,
				<Button
					key="txt"
					disabled={isLoadingPdf || isCreatingTxt}
					icon={<FileTextOutlined />}
					loading={isCreatingTxt}
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
				<Text>{`AS OF ${formatDate(report.date)}`}</Text>
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
				<Descriptions.Item
					contentStyle={{
						textDecoration: Number(report.credit_pay) ? 'underline' : 'none',
					}}
					label="CREDIT SALES"
				>
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
				<Descriptions.Item label="SC/PWD" labelStyle={{ paddingLeft: 30 }}>
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
							contentStyle={{
								textDecoration: Number(report.vat_amount)
									? 'underline'
									: 'none',
							}}
							label="VAT Amount"
							labelStyle={{ paddingLeft: 30 }}
						>
							({formatInPeso(report.vat_amount)})
						</Descriptions.Item>
					</>
				)}
				<Descriptions.Item
					contentStyle={{ fontWeight: 'bold' }}
					label="ACCUM. GRAND TOTAL"
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
						<Descriptions.Item label="SC/PWD" labelStyle={{ paddingLeft: 30 }}>
							{formatInPeso(report.vat_special_discount)}&nbsp;
						</Descriptions.Item>
						<Descriptions.Item
							contentStyle={{
								textDecoration: Number(report.others) ? 'underline' : 'none',
							}}
							label="OTHERS"
							labelStyle={{ paddingLeft: 30 }}
						>
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
						<Descriptions.Item
							contentStyle={{
								textDecoration: Number(report.total_vat_adjusted)
									? 'underline'
									: 'none',
							}}
							label="VAT ADJ."
						>
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
				<Text>{report.generated_by?.employee_id || EMPTY_CELL}</Text>
			</Space>

			<Text className="w-100 text-center d-block">
				End SI #: {report.ending_or.or_number || EMPTY_CELL}
			</Text>

			<ReceiptFooter />

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: htmlPdf }}
				style={{ display: 'none' }}
			/>
		</Modal>
	);
};
