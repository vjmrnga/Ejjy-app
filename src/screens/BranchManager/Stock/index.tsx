import { Button, Tabs } from 'antd';
import { Content } from 'components';
import { Box } from 'components/elements';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TabStockIn } from 'screens/BranchManager/Stock/components/TabStockIn';
import { TabStockOut } from 'screens/BranchManager/Stock/components/TabStockOut';

const tabs = {
	STOCK_IN: 'Stock In',
	STOCK_OUT: 'Stock Out',
};

export const Stocks = () => {
	// CUSTOM HOOKS
	const {
		params: { tab: currentTab },
		setQueryParams,
	} = useQueryParams();

	// METHODS
	useEffect(() => {
		if (!currentTab) {
			onTabClick(tabs.STOCK_IN);
		}
	}, [currentTab]);

	const onTabClick = (tab) => {
		setQueryParams(
			{ tab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Stock">
			<Box>
				<Tabs
					type="card"
					className="PaddingHorizontal PaddingVertical"
					activeKey={_.toString(currentTab)}
					onTabClick={onTabClick}
					destroyInactiveTabPane
					tabBarExtraContent={
						<Link
							to={`stocks/stock-${
								_.toString(currentTab) === tabs.STOCK_IN ? 'in' : 'out'
							}/create`}
						>
							<Button type="primary" size="large">
								Create {_.toString(currentTab)}
							</Button>
						</Link>
					}
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