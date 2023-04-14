import { Badge, Space, Tabs } from 'antd';
import { Content } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import React from 'react';
import shallow from 'zustand/shallow';
import { TabBranchStatus } from './components/TabBranchStatus';
import { TabDTR } from './components/TabDTR';
import { useNotificationStore } from './stores/useNotificationStore';

const tabs = {
	DTR: 'DTR',
	BRANCH_CONNECTIVITY: 'Branch Connectivity',
};

export const Notifications = () => {
	// CUSTOM HOOKS
	const {
		params: { tab = tabs.DTR },
		setQueryParams,
	} = useQueryParams();
	const { connectivityCount, dtrCount } = useNotificationStore(
		(state: any) => ({
			connectivityCount: state.connectivityCount,
			dtrCount: state.dtrCount,
		}),
		shallow,
	);

	// METHODS
	const handleTabClick = (selectedTab) => {
		setQueryParams(
			{ tab: selectedTab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Notifications">
			<Box>
				<Tabs
					activeKey={_.toString(tab)}
					className="pa-6"
					defaultActiveKey={tabs.DTR}
					type="card"
					onTabClick={handleTabClick}
				>
					<Tabs.TabPane
						key={tabs.DTR}
						tab={
							<Space align="center">
								<span>{tabs.DTR}</span>
								{dtrCount > 0 && <Badge count={dtrCount} overflowCount={999} />}
							</Space>
						}
					>
						<TabDTR />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.BRANCH_CONNECTIVITY}
						tab={
							<Space align="center">
								<span>{tabs.BRANCH_CONNECTIVITY}</span>
								{connectivityCount > 0 && (
									<Badge count={connectivityCount} overflowCount={999} />
								)}
							</Space>
						}
					>
						<TabBranchStatus />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
