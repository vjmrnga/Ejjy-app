import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { Box } from '../../../../components/elements';
import { useBranches } from '../../../../hooks/useBranches';
import { SalesBranch } from './SalesBranch';

export const SalesBranchSection = () => {
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
		<Box>
			<Tabs
				defaultActiveKey={branches?.[0]?.id}
				style={{ padding: '20px 25px' }}
				type="card"
				onTabClick={onTabClick}
			>
				{branches.map(({ name, id, online_url }) => (
					<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
						<SalesBranch
							isActive={id === Number(currentActiveKey)}
							branchId={id}
						/>
					</Tabs.TabPane>
				))}
			</Tabs>
		</Box>
	);
};
