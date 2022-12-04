import { Tabs } from 'antd';
import { Content, LogsInfo } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import React from 'react';
import { TabProductLogs } from './components/TabProductLogs';

export const tabs = {
	PRODUCTS: 'Products',
};

export const Logs = () => {
	// CUSTOM HOOKS
	const {
		params: { tab },
		setQueryParams,
	} = useQueryParams();

	// METHODS
	const handleTabClick = (selectedTab) => {
		setQueryParams(
			{ tab: selectedTab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Logs">
			<LogsInfo />

			<Box>
				<Tabs
					activeKey={_.toString(tab) || tabs.PRODUCTS}
					className="pa-6"
					type="card"
					destroyInactiveTabPane
					onTabClick={handleTabClick}
				>
					<Tabs.TabPane key={tabs.PRODUCTS} tab={tabs.PRODUCTS}>
						<TabProductLogs />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
