import { Col, Divider, Row } from 'antd';
import React from 'react';
import { Label } from '../../../../components/elements';

interface Props {
	preparationSlip: any;
}

export const PreparationSlipDetails = ({ preparationSlip }: Props) => {
	const renderDetail = (label, value) => (
		<Col span={24}>
			<Row gutter={{ sm: 15, xs: 0 }}>
				<Col sm={8} xs={24}>
					<Label label={label} />
				</Col>
				<Col sm={16} xs={24}>
					<span>{value}</span>
				</Col>
			</Row>
		</Col>
	);

	return (
		<Row gutter={[15, 15]}>
			{renderDetail('ID', preparationSlip?.id)}
			{renderDetail('Date & Time Created', preparationSlip?.date_time)}
			{renderDetail('Assigned User', preparationSlip?.assigned_user)}

			<Divider dashed />
		</Row>
	);
};
