import { Button, Tabs } from 'antd';
import { Content } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { stockTabs } from 'screens/BranchManager/Stock/data';
import { TabStockIn } from './components/TabStockIn';
import { TabStockOut } from './components/TabStockOut';

export const Stocks = () => {
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
		<Content title="Stock">
			<Box>
				<Tabs
					activeKey={_.toString(tab) || stockTabs.STOCK_IN}
					className="PaddingHorizontal PaddingVertical"
					tabBarExtraContent={
						<Link
							to={`stocks/stock-${
								_.toString(tab) === stockTabs.STOCK_IN ? 'in' : 'out'
							}/create`}
						>
							<Button type="primary">Create {_.toString(tab)}</Button>
						</Link>
					}
					type="card"
					destroyInactiveTabPane
					onTabClick={handleTabClick}
				>
					<Tabs.TabPane key={stockTabs.STOCK_IN} tab={stockTabs.STOCK_IN}>
						<TabStockIn />
					</Tabs.TabPane>
					<Tabs.TabPane key={stockTabs.STOCK_OUT} tab={stockTabs.STOCK_OUT}>
						<TabStockOut />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
