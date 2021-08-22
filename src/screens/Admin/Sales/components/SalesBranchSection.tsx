import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { Box } from '../../../../components/elements';
import { useBranches } from '../../../../hooks/useBranches';
import { SalesBranch } from './SalesBranch';

interface Props {
	timeRange: string;
	timeRangeOption: string;
}

export const SalesBranchSection = ({ timeRange, timeRangeOption }: Props) => {
	// STATES
	const [currentActiveKey, setCurrentActiveKey] = useState(null);

	// CUSTOM HOOKS
	const { branches } = useBranches();

	// METHODS
	useEffect(() => {
		if (branches) {
			setCurrentActiveKey(branches?.[0]?.id.toString());
		}
	}, [branches]);

	return (
		<Box>
			<Tabs
				activeKey={currentActiveKey}
				style={{ padding: '20px 25px' }}
				type="card"
				onTabClick={(branchId) => {
					setCurrentActiveKey(branchId);
				}}
			>
				{branches.map(({ name, id, online_url }) => (
					<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
						<SalesBranch
							branchId={id}
							timeRange={timeRange}
							timeRangeOption={timeRangeOption}
							isActive={id === Number(currentActiveKey)}
						/>
					</Tabs.TabPane>
				))}
			</Tabs>
		</Box>
	);
};
