import { Col, Row } from 'antd';
import React, { ReactNode } from 'react';
import { Label } from '../elements';

interface Props {
	value: string | number | ReactNode;
	label: string;
}

export const DetailsHalf = ({ value, label }: Props) => (
	<Col sm={12} xs={24}>
		<Row align="middle" gutter={{ sm: 15, xs: 0 }}>
			<Col sm={12} xs={24}>
				<Label label={label} />
			</Col>
			<Col sm={12} xs={24}>
				<span>{value}</span>
			</Col>
		</Row>
	</Col>
);
