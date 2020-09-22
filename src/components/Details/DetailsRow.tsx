import { Row } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export const DetailsRow = ({ children }: Props) => {
	return <Row gutter={[15, 15]}>{children}</Row>;
};
