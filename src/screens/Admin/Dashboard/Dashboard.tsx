import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { CashieringCard, Content } from '../../../components';
import { Box } from '../../../components/elements';
import { useBranches } from '../../../hooks/useBranches';

export const Dashboard = () => {
	// STATES
	const [currentActiveKey, setCurrentActiveKey] = useState(null);

	// CUSTOM HOOKS
	const { branches } = useBranches();

	// METHODS
	useEffect(() => {
		if (branches) {
			setCurrentActiveKey(branches?.[0]?.id);
		}
	}, [branches]);

	return (
		<Content title="Dashboard">
			<Box padding>
				<Tabs
					defaultActiveKey={branches?.[0]?.id}
					type="card"
					onTabClick={(branchId) => {
						setCurrentActiveKey(branchId);
					}}
				>
					{branches.map(({ name, id, online_url }) => (
						<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
							{id === Number(currentActiveKey) && (
								<CashieringCard
									className="BranchBalanceItem_cashieringCard"
									branchId={id}
									disabled={!online_url}
									bordered
								/>
							)}
						</Tabs.TabPane>
					))}
				</Tabs>
			</Box>
		</Content>
	);
};
