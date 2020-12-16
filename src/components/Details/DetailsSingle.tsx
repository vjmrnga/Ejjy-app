import { Col, Row } from 'antd';
import React, { ReactNode } from 'react';
import { Label } from '../elements';

interface Props {
	value: string | number | ReactNode;
	label: string;
	labelSpan?: number;
	valueSpan?: number;
	classNamesLabel?: string;
	classNamesValue?: string;
}

export const DetailsSingle = ({
	value,
	label,
	labelSpan,
	valueSpan,
	classNamesLabel,
	classNamesValue,
}: Props) => {
	return (
		<Col span={24}>
			<Row gutter={{ sm: 15, xs: 0 }}>
				<Col sm={labelSpan} xs={24}>
					<Label classNames={classNamesLabel} label={label} />
				</Col>
				<Col sm={valueSpan} xs={24}>
					<span className={classNamesValue}>{value}</span>
				</Col>
			</Row>
		</Col>
	);
};

DetailsSingle.defaultProps = {
	labelSpan: 8,
	valueSpan: 16,
};
