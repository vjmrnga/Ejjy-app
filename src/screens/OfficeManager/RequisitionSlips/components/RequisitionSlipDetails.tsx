import { PrinterOutlined } from '@ant-design/icons';
import { Button, Descriptions } from 'antd';
import { ViewRequisitionSlipModal } from 'components';
import { Select } from 'components/elements';
import { request, requisitionSlipActionsOptions } from 'global';
import { useRequisitionSlips } from 'hooks/useRequisitionSlips';
import { upperFirst } from 'lodash';
import React, { useState } from 'react';
import { formatDateTime, getRequestor } from 'utils';
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
	const [isPrintPreviewVisible, setIsPrintPreviewVisible] = useState(false);

	// CUSTOM HOOKS
	const { editRequisitionSlip, status: requisitionSlipsStatus } =
		useRequisitionSlips();

	// METHODS

	const handleStatusChange = (status) => {
		editRequisitionSlip(requisitionSlip.id, status);
	};

	return (
		<>
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
					{getRequestor(requisitionSlip)}
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
					<Button
						icon={<PrinterOutlined />}
						size="large"
						type="primary"
						onClick={() => {
							setIsPrintPreviewVisible(true);
						}}
					>
						Print Preview
					</Button>
				</Descriptions.Item>
			</Descriptions>

			{isPrintPreviewVisible && (
				<ViewRequisitionSlipModal
					requisitionSlip={requisitionSlip}
					onClose={() => setIsPrintPreviewVisible(false)}
				/>
			)}
		</>
	);
};
