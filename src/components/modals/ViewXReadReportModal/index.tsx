import {
	FilePdfOutlined,
	FileTextOutlined,
	PrinterOutlined,
} from '@ant-design/icons';
import { Button, Descriptions, Modal, Space, Typography } from 'antd';
import { ReceiptFooter, ReceiptHeader } from 'components/Receipt';
import { printXReadReport } from 'configurePrinter';
import { createXReadTxt } from 'configureTxt';
import dayjs from 'dayjs';
import { EMPTY_CELL } from 'global';
import { useSiteSettingsRetrieve } from 'hooks';
import jsPDF from 'jspdf';
import React, { useState } from 'react';
import { formatDate, formatInPeso } from 'utils';
import './style.scss';

interface Props {
	report: any;
	onClose: any;
}

const { Text, Title } = Typography;

export const ViewXReadReportModal = ({ report, onClose }: Props) => {
	// STATES
	const [isCreatingPdf, setIsCreatingPdf] = useState(false);
	const [isCreatingTxt, setIsCreatingTxt] = useState(false);
	const [html, setHtml] = useState('');

	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettingsRetrieve({
		options: { refetchOnMount: 'always' },
	});

	// METHODS
	const onPrint = () => {
		printXReadReport({ report, siteSettings });
	};

	const onCreatePdf = () => {
		setIsCreatingPdf(true);

		// eslint-disable-next-line new-cap
		const pdf = new jsPDF({
			orientation: 'p',
			unit: 'px',
			format: 'legal',
			hotfixes: ['px_scaling'],
		});

		const dataHtml = printXReadReport({ report, siteSettings, isPdf: true });

		setHtml(dataHtml);

		if (report?.gross_sales === 0) {
			const img = new Image();
			img.src = require('../../../assets/images/no-transaction.png');
			pdf.addImage(img, 'png', 150, 50, 500, 758);
		}

		setTimeout(() => {
			pdf.html(dataHtml, {
				margin: 10,
				filename: `XReadReport_${report.id}`,
				callback: (instance) => {
					window.open(instance.output('bloburl').toString());
					setIsCreatingPdf(false);
					setHtml('');
				},
			});
		}, 2000);
	};

	const onCreateTxt = () => {
		setIsCreatingTxt(true);
		createXReadTxt({ report, siteSettings });
		setIsCreatingTxt(false);
	};

	return (
		<Modal
			className="ViewXReadReportModal Modal__hasFooter"
			title="X-Read Report"
			footer={[
				<Button
					key="print"
					disabled={isCreatingPdf || isCreatingTxt}
					icon={<PrinterOutlined />}
					size="large"
					type="primary"
					onClick={onPrint}
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
					onClick={onCreatePdf}
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
					onClick={onCreateTxt}
				>
					Create TXT
				</Button>,
			]}
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
			<ReceiptHeader />

			<Space align="center" className="mt-6 w-100 justify-space-between">
				<Text>X-READ</Text>
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
					{formatInPeso(report.cash_sales)}
				</Descriptions.Item>
				<Descriptions.Item label="CREDIT SALES">
					{formatInPeso(report.credit_pay)}
				</Descriptions.Item>
				<Descriptions.Item label="GROSS SALES">
					{formatInPeso(Number(report.cash_sales) + Number(report.credit_pay))}
				</Descriptions.Item>

				<Descriptions.Item label="DISCOUNTS" labelStyle={{ paddingLeft: 30 }}>
					({formatInPeso(report.discount)})
				</Descriptions.Item>
				<Descriptions.Item
					label="VOIDED SALES"
					labelStyle={{ paddingLeft: 30 }}
				>
					({formatInPeso(report.sales_return)})
				</Descriptions.Item>

				<Descriptions.Item
					contentStyle={{ fontWeight: 'bold' }}
					label="NET SALES"
					labelStyle={{ fontWeight: 'bold' }}
				>
					{formatInPeso(report.net_sales)}
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
					{formatInPeso(report.vat_exempt)}
				</Descriptions.Item>
				<Descriptions.Item label="VAT Sales">
					{formatInPeso(report.vat_sales)}
				</Descriptions.Item>
				<Descriptions.Item label="VAT Amount">
					{formatInPeso(report.vat_12_percent)}
				</Descriptions.Item>
				<Descriptions.Item label="ZERO Rated">
					{formatInPeso(0)}
				</Descriptions.Item>
			</Descriptions>

			<Space className="mt-6 w-100 justify-space-between">
				<Text>{report?.branch_machine?.name || 'MN'}</Text>
				<Text>{dayjs().format('MM/DD/YYYY h:mmA')}</Text>
				<Text>{report.total_transactions} tran(s)</Text>
			</Space>
			<Space className="w-100 justify-space-between">
				<Text>
					C:{' '}
					{report?.cashiering_session
						? report.cashiering_session.user.employee_id
						: ''}
				</Text>
				<Text>PB: {report?.generated_by?.employee_id || EMPTY_CELL}</Text>
			</Space>

			<Space
				align="center"
				className="mt-6 w-100 text-center"
				direction="vertical"
				size={0}
			>
				<Text>
					Beginning OR #: {report?.beginning_or?.or_number || EMPTY_CELL}
				</Text>
				<Text>Ending OR #: {report?.ending_or?.or_number || EMPTY_CELL}</Text>
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
					{formatInPeso(report?.beginning_sales)}
				</Descriptions.Item>
				<Descriptions.Item label="Cur Sales">
					{formatInPeso(report?.total_sales)}
				</Descriptions.Item>
				<Descriptions.Item label="End Sales">
					{formatInPeso(report?.ending_sales)}
				</Descriptions.Item>
			</Descriptions>

			<ReceiptFooter />

			<div
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>
		</Modal>
	);
};
