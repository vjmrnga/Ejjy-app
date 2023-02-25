import { Button, Col, Row, Statistic } from 'antd';
import React from 'react';
import { useUserStore } from 'stores';
import { formatInPeso, getFullName, isCUDShown } from 'utils';
import './style.scss';

interface Props {
	account: any;
	totalBalance: number;
	disabled: boolean;
	onClick: any;
}

export const AccountTotalBalance = ({
	account,
	totalBalance,
	disabled,
	onClick,
}: Props) => {
	const user = useUserStore((state) => state.user);

	return (
		<div className="AccountTotalBalance mb-4">
			<Row gutter={[16, 16]}>
				<Col md={12}>
					<Statistic title="Client" value={getFullName(account)} />
				</Col>
				<Col md={12}>
					<Statistic title="Total Balance" value={formatInPeso(totalBalance)} />
					{isCUDShown(user.user_type) && (
						<Button
							className="mt-3"
							disabled={disabled}
							type="primary"
							onClick={onClick}
						>
							Create Order of Payment
						</Button>
					)}
				</Col>
			</Row>
		</div>
	);
};
