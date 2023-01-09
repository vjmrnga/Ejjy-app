import { Descriptions, Divider } from 'antd';
import React from 'react';
import { formatDateTime } from 'utils';

interface Props {
	className?: string;
	preparationSlip: any;
}

export const PreparationSlipDetails = ({
	className,
	preparationSlip,
}: Props) => (
	<>
		<Descriptions className={className} column={1} bordered>
			<Descriptions.Item label="ID">{preparationSlip?.id}</Descriptions.Item>
			<Descriptions.Item label="Date & Time Created">
				{formatDateTime(preparationSlip?.datetime_created)}
			</Descriptions.Item>
		</Descriptions>

		<Divider style={{ marginTop: '12px', marginBottom: '17px' }} dashed />
	</>
);
