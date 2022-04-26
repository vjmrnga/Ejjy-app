import { Descriptions, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { EMPTY_CELL } from 'global';
import { useSiteSettingsRetrieve } from 'hooks';
import React from 'react';
import { formatDate, formatInPeso } from 'utils/function';

const { Text, Title } = Typography;

interface Props {
	report: any;
	onClose: any;
}

export const ViewZReadReportModal = ({ report, onClose }: Props) => {
	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettingsRetrieve({
		options: { refetchOnMount: 'always' },
	});

	return (
		<Modal
			title="Z-Read Report"
			width={425}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Space
				align="center"
				className="w-100 text-center"
				direction="vertical"
				size={0}
			>
				<Title level={3}>EJY AND JY</Title>
				<Text>WET MARKET AND ENTERPRISES</Text>
				<Text>POB., CARMEN, AGUSAN DEL NORTE</Text>
				<Text>Tel#: 080-8866</Text>
				<Text>{report.proprietor}</Text>
				<Text>{report.location}</Text>
				<Text>
					{siteSettings.tax_type} | {report.tin}
				</Text>
				<Text>Machine ID Number</Text>
				<Text>Software License Number</Text>
			</Space>

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
				<Text>{report?.generated_by?.employee_id || EMPTY_CELL}</Text>
			</Space>

			<Text className="w-100 text-center d-block">
				End OR #: {report?.ending_or?.or_number || EMPTY_CELL}
			</Text>

			<Space
				align="center"
				className="mt-8 w-100 text-center"
				direction="vertical"
				size={0}
			>
				<Text>{siteSettings.software_developer}</Text>
				<Text>Burgos St., Poblacion, Carmen,</Text>
				<Text>Agusan del Norte</Text>
				<Text>{siteSettings.software_developer_tin}</Text>
				<Text>{siteSettings.pos_accreditation_number}</Text>
				<Text>{siteSettings.pos_accreditation_date}</Text>
				<Text>{siteSettings.pos_accreditation_valid_until_date}</Text>
			</Space>
		</Modal>
	);
};