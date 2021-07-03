import { Row } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export const DetailsRow = ({ children }: Props) => (
	<Row gutter={[15, 15]}>{children}</Row>
);
