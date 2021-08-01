import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { Content } from '../../../components';
import { Box } from '../../../components/elements';
import { useBranches } from '../../../hooks/useBranches';
import { ReportsBranch } from './components/ReportsBranch';
import './style.scss';

export const Reports = () => {
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
		<Content className="Reports" title="Reports">
			<Box>
				<Tabs
					defaultActiveKey={branches?.[0]?.id}
					style={{ padding: '20px 25px' }}
					type="card"
					onTabClick={onTabClick}
				>
					{branches.map(({ name, id, online_url }) => (
						<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
							<ReportsBranch
								isActive={id === Number(currentActiveKey)}
								branchId={id}
							/>
						</Tabs.TabPane>
					))}
				</Tabs>
			</Box>
		</Content>
	);
};
