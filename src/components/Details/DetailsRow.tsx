import { Row } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
	children: ReactNode;
	className?: string;
}

export const DetailsRow = ({ children, className }: Props) => (
	<Row className={className} gutter={[16, 16]}>
		{children}
	</Row>
);
