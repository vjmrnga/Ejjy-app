import { Col, Row, Statistic } from 'antd';
import React from 'react';
import { formatInPeso, getFullName } from 'utils/function';
import './style.scss';

interface Props {
	account: any;
	totalBalance: number;
}

export const AccountTotalBalance = ({ account, totalBalance }: Props) => (
	<div className="AccountTotalBalance mb-4">
		<Row gutter={[16, 16]}>
			<Col span={12}>
				<Statistic title="Creditor" value={getFullName(account)} />
			</Col>
			<Col span={12}>
				<Statistic title="Total Balance" value={formatInPeso(totalBalance)} />
			</Col>
		</Row>
	</div>
);
