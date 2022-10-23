import { FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Descriptions, Space, Spin } from 'antd';
import { Select } from 'components/elements';
import { printRequisitionSlip } from 'configurePrinter';
import { request, requisitionSlipActionsOptions } from 'global';
import { useAuth, useSiteSettingsRetrieve } from 'hooks';
import { useRequisitionSlips } from 'hooks/useRequisitionSlips';
import jsPDF from 'jspdf';
import { upperFirst } from 'lodash';
import React, { useCallback, useState } from 'react';
import { formatDateTime } from 'utils';
import '../style.scss';

export const requisitionSlipDetailsType = {
	SINGLE_VIEW: 'single_view',
	CREATE_EDIT: 'create_edit',
};

interface Props {
	requisitionSlip: any;
	type: string;
}

export const RequisitionSlipDetails = ({ requisitionSlip, type }: Props) => {
	// STATES
	const [isCreatingPdf, setIsCreatingPdf] = useState(false);
	const [html, setHtml] = useState('');

	// CUSTOM HOOKS
	const { user } = useAuth();
	const { data: siteSettings, isFetching: isFetchingSiteSettings } =
		useSiteSettingsRetrieve();
	const { editRequisitionSlip, status: requisitionSlipsStatus } =
		useRequisitionSlips();

	// METHODS
	const getRequestor = useCallback(() => {
		const {
			first_name = '',
			last_name = '',
			branch = {},
		} = requisitionSlip?.requesting_user || {};
		return `${first_name} ${last_name} - ${branch?.name || ''}`;
	}, [requisitionSlip]);

	const handleStatusChange = (status) => {
		editRequisitionSlip(requisitionSlip.id, status);
	};

	const handlePrint = () => {
		printRequisitionSlip({ requisitionSlip, siteSettings, user });
	};

	const handleCreatePdf = () => {
		setIsCreatingPdf(true);

		// eslint-disable-next-line new-cap
		const pdf = new jsPDF({
			orientation: 'p',
			unit: 'px',
			format: 'legal',
			hotfixes: ['px_scaling'],
		});

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
		<Spin spinning={isFetchingSiteSettings}>
			<Descriptions
				className="pa-6 pb-0 w-100"
				column={2}
				labelStyle={{
					width: 200,
				}}
				size="small"
				bordered
			>
				<Descriptions.Item label="Date & Time Created">
					{formatDateTime(requisitionSlip.datetime_created)}
				</Descriptions.Item>

				<Descriptions.Item label="Requestor">
					{getRequestor()}
				</Descriptions.Item>

				{type === requisitionSlipDetailsType.SINGLE_VIEW && (
					<>
						<Descriptions.Item label="Request Type">
							{upperFirst(requisitionSlip.type)}
						</Descriptions.Item>

						<Descriptions.Item label="Status">
							<Select
								classNames="status-select"
								disabled={requisitionSlipsStatus === request.REQUESTING}
								options={requisitionSlipActionsOptions}
								placeholder="status"
								value={requisitionSlip?.action?.action}
								onChange={handleStatusChange}
							/>
						</Descriptions.Item>
					</>
				)}

				{type === requisitionSlipDetailsType.CREATE_EDIT && (
					<Descriptions.Item label="F-RS1">
						{requisitionSlip.id}
					</Descriptions.Item>
				)}

				<Descriptions.Item label="Actions" span={2}>
					<Space>
						<Button
							key="print"
							disabled={isCreatingPdf}
							icon={<PrinterOutlined />}
							size="large"
							type="primary"
							onClick={handlePrint}
						>
							Print
						</Button>
						<Button
							key="pdf"
							disabled={isCreatingPdf}
							icon={<FilePdfOutlined />}
							loading={isCreatingPdf}
							size="large"
							type="primary"
							onClick={handleCreatePdf}
						>
							Create PDF
						</Button>
					</Space>
				</Descriptions.Item>
			</Descriptions>

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>
		</Spin>
	);
};
