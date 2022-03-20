import { Button, Col, Row, Statistic } from 'antd';
import { Box } from 'components/elements';
import {} from 'global/types';
import React from 'react';
import { formatInPeso, getFullName } from 'utils/function';
import './style.scss';

interface Props {
	account: any;
	total_balance: number;
}

export const AccountTotalBalance = ({ account, total_balance }: Props) => (
	<Row className="AccountTotalBalance mb-4" gutter={[16, 16]}>
		<Col span={12}>
			<Statistic title="Creditor" value={getFullName(account)} />
		</Col>
		<Col span={12}>
			<Statistic title="Total Balance" value={formatInPeso(total_balance)} />
		</Col>
	</Row>
);
