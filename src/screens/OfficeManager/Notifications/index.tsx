import { Badge, Space, Tabs } from 'antd';
import { Content, NotificationsInfo } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import React from 'react';
import { TabDTR } from 'screens/Shared/Notifications/TabDTR';

const tabs = {
	DTR: 'DTR',
};

export const Notifications = () => {
	// CUSTOM HOOKS
	const {
		params: { tab },
		setQueryParams,
	} = useQueryParams();
	// const {
	// 	data: { total: branchProductsCount },
	// } = useBranchProducts({
	// 	params: {
	// 		hasNegativeBalance: true,
	// 		pageSize: MAX_PAGE_SIZE,
	// 	},
	// 	options: { notifyOnChangeProps: ['data'] },
	// });

	// METHODS
	const handleTabClick = (selectedTab) => {
		setQueryParams(
			{ tab: selectedTab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Notifications">
			<NotificationsInfo />

			<Box>
				<Tabs
					activeKey={_.toString(tab) || tabs.DTR}
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
								<Badge count={1} overflowCount={999} />
							</Space>
						}
					>
						<TabDTR />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
