import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { Content } from '../../../components';
import { Box } from '../../../components/elements';
import { useBranches } from '../../../hooks/useBranches';
import { BranchCheckings } from './components/BranchCheckings';

export const Checkings = () => {
	// STATES
	const [currentActiveKey, setCurrentActiveKey] = useState(null);

	// CUSTOM HOOKS
	const { branches } = useBranches();

	// METHODS
	useEffect(() => {
		if (branches) {
			onTabClick(branches?.[0]?.id);
		}
	}, [branches]);

	const onTabClick = (branchId) => {
		setCurrentActiveKey(branchId);
	};

	return (
		<Content className="Checkings" title="Checkings">
			<Box padding>
				<Tabs
					defaultActiveKey={branches?.[0]?.id}
					type="card"
					onTabClick={onTabClick}
				>
					{branches.map(({ name, id, online_url }) => (
						<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
							<BranchCheckings
								branchId={id}
								isActive={id === Number(currentActiveKey)}
							/>
						</Tabs.TabPane>
					))}
				</Tabs>
			</Box>
		</Content>
	);
};
