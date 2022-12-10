import { Button, Tabs } from 'antd';
import { Content, StocksInfo } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { TabStockIn } from './components/TabStockIn';
import { TabStockOut } from './components/TabStockOut';

const tabs = {
	STOCK_IN: 'Stock In',
	STOCK_OUT: 'Stock Out',
};

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
			<StocksInfo />

			<Box>
				<Tabs
					activeKey={_.toString(tab) || tabs.STOCK_IN}
					className="PaddingHorizontal PaddingVertical"
					tabBarExtraContent={
						<Link
							to={`stocks/stock-${
								_.toString(tab) === tabs.STOCK_IN ? 'in' : 'out'
							}/create`}
						>
							<Button type="primary">Create {_.toString(tab)}</Button>
						</Link>
					}
					type="card"
					destroyInactiveTabPane
					onTabClick={handleTabClick}
				>
					<Tabs.TabPane key={tabs.STOCK_IN} tab={tabs.STOCK_IN}>
						<TabStockIn />
					</Tabs.TabPane>
					<Tabs.TabPane key={tabs.STOCK_OUT} tab={tabs.STOCK_OUT}>
						<TabStockOut />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
