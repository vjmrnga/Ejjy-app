import { Button, Col, Row, Statistic } from 'antd';
import React from 'react';
import { formatInPeso, getFullName } from 'utils/function';
import './style.scss';

interface Props {
	account: any;
	totalBalance: number;
	onClick: any;
}

export const AccountTotalBalance = ({
	account,
	totalBalance,
	onClick,
}: Props) => (
	<div className="AccountTotalBalance mb-4">
		<Row gutter={[16, 16]}>
			<Col span={12}>
				<Statistic title="Creditor" value={getFullName(account)} />
			</Col>
			<Col span={12}>
				<Statistic title="Total Balance" value={formatInPeso(totalBalance)} />
				<Button className="mt-3" type="primary" onClick={onClick}>
					Create Order of Payment
				</Button>
			</Col>
		</Row>
	</div>
);
