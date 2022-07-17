import { Tabs } from 'antd';
import { Content } from 'components';
import { Box } from 'components/elements';
import { useBranches } from 'hooks';
import React, { useEffect, useState } from 'react';

export const Dashboard = () => {
	// STATES
	const [, setCurrentActiveKey] = useState(null);

	// CUSTOM HOOKS
	const {
		data: { branches },
	} = useBranches();

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
						<Tabs.TabPane key={id} disabled={!online_url} tab={name}>
							{/* {id === Number(currentActiveKey) && (
								<CashieringCard
									className="BranchBalanceItem_cashieringCard"
									branchId={id}
									disabled={!online_url}
									bordered
								/>
							)} */}
						</Tabs.TabPane>
					))}
				</Tabs>
			</Box>
		</Content>
	);
};
