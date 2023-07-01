import { FileTextOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Space, Typography } from 'antd';
import {
	PdfButtons,
	ReceiptFooter,
	ReceiptHeader,
	ReceiptUnderlinedValue,
	ReceiptReportSummary,
} from 'components/Printing';
import { printZReadReport } from 'configurePrinter';
import { createZReadTxt } from 'configureTxt';
import dayjs from 'dayjs';
import { EMPTY_CELL } from 'global';
import { usePdf, useSiteSettings } from 'hooks';
import React, { useState } from 'react';
import { useUserStore } from 'stores';
import { formatDateTime, formatInPeso } from 'utils';

const { Text } = Typography;

interface Props {
	report: any;
	onClose: any;
}

export const ViewZReadReportModal = ({ report, onClose }: Props) => {
	// STATES
	const [isCreatingTxt, setIsCreatingTxt] = useState(false);

	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const { data: siteSettings } = useSiteSettings();
	const { htmlPdf, isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		title: `ZReadReport_${report.id}.pdf`,
		print: () => printZReadReport({ report, siteSettings, user, isPdf: true }),
	});

	// METHODS
	const handlePrint = () => {
		printZReadReport({ report, siteSettings, user });
	};

	const handleCreateTxt = () => {
		setIsCreatingTxt(true);
		createZReadTxt({ report, siteSettings, user });
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
			open
			onCancel={onClose}
		>
			{report?.branch_machine && (
				<ReceiptHeader branchMachine={report.branch_machine} />
			)}

			<Space className="mt-6 w-100" direction="vertical">
				<Text className="w-100">Z-READ</Text>

				<Text className="w-100 mt-2 d-block">INVOICE NUMBER</Text>
				<ReceiptReportSummary
					data={[
						{ label: 'Beg Invoice #', value: '01-000100' },
						{ label: 'End Invoice #', value: '01-000100' },
					]}
				/>

				<Text className="w-100 mt-2 d-block">SALES</Text>
				<ReceiptReportSummary
					data={[
						{ label: 'Beg', value: 'PHP 150,000.00' },
						{ label: 'Cur', value: 'PHP 180,881.13' },
						{ label: 'End', value: 'PHP 330,881.13' },
					]}
				/>

				<Text className="w-100 mt-2 d-block">TRANSACTION COUNT</Text>
				<ReceiptReportSummary
					data={[
						{ label: 'Beg', value: '100' },
						{ label: 'Cur', value: '80' },
						{ label: 'End', value: '95' },
					]}
				/>
			</Space>

			<Text className="w-100 mt-6 text-center d-block">
				ACCUMULATED SALES BREAKDOWN
			</Text>

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
					<ReceiptUnderlinedValue postfix="&nbsp;" value={report.credit_pay} />
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
				<Descriptions.Item label="VAT Exempt" labelStyle={{ paddingLeft: 30 }}>
					{formatInPeso(report.vat_exempt)}&nbsp;
				</Descriptions.Item>
				<Descriptions.Item label="VAT Sales" labelStyle={{ paddingLeft: 30 }}>
					{formatInPeso(report.vat_sales)}&nbsp;
				</Descriptions.Item>
				<Descriptions.Item
					label="VAT Amount (12%)"
					labelStyle={{ paddingLeft: 30 }}
				>
					{formatInPeso(report.vat_amount)}&nbsp;
				</Descriptions.Item>
				<Descriptions.Item label="ZERO Rated" labelStyle={{ paddingLeft: 30 }}>
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
				<Descriptions.Item
					label="VAT Amount (12%)"
					labelStyle={{ paddingLeft: 30 }}
				>
					<ReceiptUnderlinedValue
						postfix=")"
						prefix="("
						value={report.vat_amount}
					/>
				</Descriptions.Item>
				<Descriptions.Item
					contentStyle={{ fontWeight: 'bold' }}
					label="ACCUM. GRAND TOTAL"
					labelStyle={{ fontWeight: 'bold' }}
				>
					{formatInPeso(report.net_sales)}&nbsp;
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
				<Descriptions.Item label="ADJUSTMENT ON VAT">{null}</Descriptions.Item>
				<Descriptions.Item label="SC/PWD" labelStyle={{ paddingLeft: 30 }}>
					{formatInPeso(report.vat_special_discount)}&nbsp;
				</Descriptions.Item>
				<Descriptions.Item label="OTHERS" labelStyle={{ paddingLeft: 30 }}>
					<ReceiptUnderlinedValue postfix="&nbsp;" value={report.others} />
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
				<Descriptions.Item label="VAT AMOUNT (12%)">
					{formatInPeso(report.vat_amount)}&nbsp;
				</Descriptions.Item>
				<Descriptions.Item label="VAT ADJ.">
					<ReceiptUnderlinedValue
						postfix=")"
						prefix="("
						value={report.total_vat_adjusted}
					/>
				</Descriptions.Item>
				<Descriptions.Item label="VAT PAYABLE">
					{formatInPeso(report.vat_payable)}
					&nbsp;
				</Descriptions.Item>
			</Descriptions>

			<Space className="mt-6 w-100" direction="vertical">
				<Text>GDT: {formatDateTime(report.date)}</Text>
				<Text>PDT: {formatDateTime(dayjs())}</Text>
			</Space>

			<Space className="mt-2 w-100 justify-space-between">
				<Text>C: WIP</Text>
				<Text>PB: {user?.employee_id || EMPTY_CELL}</Text>
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
