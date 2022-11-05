import { Descriptions } from 'antd';
import cn from 'classnames';
import { requisitionSlipDetailsType } from 'global';
import { upperFirst } from 'lodash';
import React from 'react';
import { formatDateTime, getRequestor } from 'utils';

interface Props {
	requisitionSlip: any;
	type: string;
}

export const RequisitionSlipDetails = ({ requisitionSlip, type }: Props) => (
	<Descriptions
		className={cn('w-100', {
			'px-6 pt-6': type === requisitionSlipDetailsType.SINGLE_VIEW,
		})}
		column={2}
		labelStyle={{ width: 200 }}
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
			<Descriptions.Item label="Request Type">
				{upperFirst(requisitionSlip.type)}
			</Descriptions.Item>
		)}

		{type === requisitionSlipDetailsType.CREATE_EDIT && (
			<Descriptions.Item label="F-RS1">{requisitionSlip.id}</Descriptions.Item>
		)}
	</Descriptions>
);
