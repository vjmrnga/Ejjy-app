import { Divider } from 'antd';
import React from 'react';
import { DetailsRow, DetailsSingle } from '..';
import { formatDateTime } from 'utils';

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

		<Divider dashed style={{ marginTop: '12px', marginBottom: '17px' }} />
	</DetailsRow>
);
