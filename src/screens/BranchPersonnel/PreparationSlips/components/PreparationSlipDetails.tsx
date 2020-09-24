import { Divider } from 'antd';
import React from 'react';
import { DetailsRow, DetailsSingle } from '../../../../components';
import { formatDateTime } from '../../../../utils/function';

interface Props {
	preparationSlip: any;
}

export const PreparationSlipDetails = ({ preparationSlip }: Props) => {
	return (
		<DetailsRow>
			<DetailsSingle label="ID" value={preparationSlip?.id} />
			<DetailsSingle
				label="Date & Time Created"
				value={formatDateTime(preparationSlip?.datetime_created)}
			/>
			<DetailsSingle
				label="Assigned User"
				value={`${preparationSlip?.requesting_user.first_name} ${preparationSlip?.requesting_user.last_name}`}
			/>

			<Divider dashed />
		</DetailsRow>
	);
};
