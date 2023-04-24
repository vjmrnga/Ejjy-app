import { FileTextOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Space, Typography } from 'antd';
import { PdfButtons, ReceiptFooter, ReceiptHeader } from 'components/Printing';
import { printXReadReport } from 'configurePrinter';
import { createXReadTxt } from 'configureTxt';
import dayjs from 'dayjs';
import { EMPTY_CELL, taxTypes } from 'global';
import { usePdf, useSiteSettings } from 'hooks';
import React, { useState } from 'react';
import { formatDate, formatInPeso } from 'utils';
import './style.scss';

interface Props {
	report: any;
	onClose: any;
}

const { Text } = Typography;

export const ViewXReadReportModal = ({ report, onClose }: Props) => {
	// STATES
	const [isCreatingTxt, setIsCreatingTxt] = useState(false);

	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettings();
	const { htmlPdf, isLoadingPdf, previewPdf, downloadPdf } = usePdf({
		title: `XReadReport_${report.id}.pdf`,
		image:
			report?.gross_sales === 0
				? {
						src: require('../../../assets/images/no-transaction.png'),
						x: 50,
						y: 50,
						w: 300,
						h: 600,
				  }
				: null,
		print: () => printXReadReport({ report, siteSettings, isPdf: true }),
	});

	// METHODS
	const handlePrint = () => {
		printXReadReport({ report, siteSettings });
	};

	const handleCreateTxt = () => {
		setIsCreatingTxt(true);
		createXReadTxt({ report, siteSettings });
		setIsCreatingTxt(false);
	};

	return (
		<Modal
			className="ViewXReadReportModal Modal__hasFooter"
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
			title="X-Read Report"
			width={425}
			centered
			closable
			visible
			onCancel={onClose}
		>
			{report?.gross_sales === 0 && (
				<img
					alt="no transaction"
					className="img-no-transaction"
					src={require('../../../assets/images/no-transaction.png')}
				/>
			)}
			{report?.branch_machine && (
				<ReceiptHeader branchMachine={report.branch_machine} />
			)}

			<Space align="center" className="mt-6 w-100 justify-space-between">
				<Text>X-READ</Text>
				<Text>{`For ${formatDate(report.datetime_created)}`}</Text>
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
						<Descriptions.Item label="SC/PWD" labelStyle={{ paddingLeft: 30 }}>
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
				<Text>{report.total_transactions} tran(s)</Text>
			</Space>
			<Space className="w-100 justify-space-between">
				<Text>{report.generated_by.employee_id}</Text>
			</Space>

			<Space
				align="center"
				className="mt-6 w-100 text-center"
				direction="vertical"
				size={0}
			>
				<Text>
					Beginning SI #: {report.beginning_or?.or_number || EMPTY_CELL}
				</Text>
				<Text>Ending SI #: {report.ending_or?.or_number || EMPTY_CELL}</Text>
			</Space>

			<Descriptions
				colon={false}
				column={1}
				labelStyle={{
					width: 200,
					paddingLeft: 15,
				}}
				size="small"
			>
				<Descriptions.Item label="Beg Sales">
					{formatInPeso(report.beginning_sales)}
				</Descriptions.Item>
				<Descriptions.Item label="Cur Sales">
					{formatInPeso(report.total_sales)}
				</Descriptions.Item>
				<Descriptions.Item label="End Sales">
					{formatInPeso(report.ending_sales)}
				</Descriptions.Item>
			</Descriptions>

			<ReceiptFooter />

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: htmlPdf }}
				style={{ display: 'none' }}
			/>
		</Modal>
	);
};
