import { Divider } from 'antd';
import React from 'react';
import { DetailsRow, DetailsSingle } from '../../../../components';

interface Props {
	preparationSlip: any;
}

export const PreparationSlipDetails = ({ preparationSlip }: Props) => {
	return (
		<DetailsRow>
			<DetailsSingle label="ID" value={preparationSlip?.id} />
			<DetailsSingle label="Date & Time Created" value={preparationSlip?.date_time} />
			<DetailsSingle label="Assigned User" value={preparationSlip?.assigned_user} />

			<Divider dashed />
		</DetailsRow>
	);
};
