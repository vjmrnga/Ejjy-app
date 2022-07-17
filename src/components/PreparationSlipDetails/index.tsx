import { Divider } from 'antd';
import React from 'react';
import { formatDateTime } from 'utils';
import { DetailsRow, DetailsSingle } from '..';

interface Props {
	preparationSlip: any;
	className?: string;
}

export const PreparationSlipDetails = ({
	preparationSlip,
	className,
}: Props) => (
	<DetailsRow className={className}>
		<DetailsSingle label="ID" value={preparationSlip?.id} />
		<DetailsSingle
			label="Date & Time Created"
			value={formatDateTime(preparationSlip?.datetime_created)}
		/>

		<Divider style={{ marginTop: '12px', marginBottom: '17px' }} dashed />
	</DetailsRow>
);
