import { message, Spin, Tabs } from 'antd';
import { Breadcrumb, Content, RequestErrors } from 'components';
import { Box } from 'components/elements';
import { GENERIC_ERROR_MESSAGE, request } from 'global';
import {
	useBranchMachineRetrieve,
	useBranchMachines,
	useQueryParams,
} from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { toString } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { TabBirReport } from 'screens/BranchManager/BranchMachines/components/TabBirReport';
import { TabDailyProductSalesReport } from 'screens/BranchManager/BranchMachines/components/TabDailyProductSalesReport';
import { convertIntoArray, getUrlPrefix } from '../../../utils/function';
import { TabConnectivityLogs } from './components/TabConnectivityLogs';
import { TabDailyInvoiceReport } from './components/TabDailyInvoiceReport';
import { TabDays } from './components/TabDays';
import { TabSessions } from './components/TabSessions';
import { TabTransactionAdjustmentReport } from './components/TabTransactionAdjustmentReport';
import { TabTransactions } from './components/TabTransactions';
import './style.scss';

interface Props {
	match: any;
}

const tabs = {
	TRANSACTIONS: 'Transactions',
	DAILY_INVOICE_REPORT: 'Daily Invoice Report',
	DAILY_PRODUCT_SALES_REPORT: 'Daily Product Sales Report',
	TRANSACTION_ADJUSTMENTS_REPORT: 'Transaction Adjustments Report',
	BIR_REPORT: 'BIR Report',
	SESSIONS: 'Sessions',
	DAYS: 'Days',
	CONNECTIVITY_LOGS: 'Connectivity Logs',
};

export const ViewBranchMachine = ({ match }: Props) => {
	// VARIABLES
	const branchMachineId = match?.params?.id;

	// CUSTOM HOOKS
	const {
		params: { tab: currentTab },
		setQueryParams,
	} = useQueryParams();
	const { user } = useAuth();
	const history = useHistory();
	const {
		data: branchMachine,
		isFetching,
		isFetched,
		error,
	} = useBranchMachineRetrieve({ id: branchMachineId });

	// METHODS

	useEffect(() => {
		if (!currentTab) {
			onTabClick(tabs.TRANSACTIONS);
		}
	}, []);

	useEffect(() => {
		if (isFetched && !branchMachine) {
			history.replace(`/branch-manager/branch-machines`);
			message.error(GENERIC_ERROR_MESSAGE);
		}
	}, [branchMachine, isFetched]);

	const getBreadcrumbItems = useCallback(
		() => [
			{
				name: 'Branch Machines',
				link: `${getUrlPrefix(user.user_type)}/branch-machines`,
			},
			{ name: branchMachine?.name },
		],
		[branchMachine, user],
	);

	const onTabClick = (tab) => {
		setQueryParams(
			{ tab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content
			title="[VIEW] Branch Machine"
			rightTitle={branchMachine?.name}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			<Spin spinning={isFetching}>
				<Box className="ViewBranchMachine">
					{error && (
						<div className="PaddingVertical PaddingHorizontal">
							<RequestErrors errors={convertIntoArray(error)} />
						</div>
					)}

					{branchMachine?.server_url && (
						<Tabs
							type="card"
							className="PaddingHorizontal PaddingVertical"
							activeKey={toString(currentTab)}
							onTabClick={onTabClick}
							destroyInactiveTabPane
						>
							<Tabs.TabPane key={tabs.TRANSACTIONS} tab={tabs.TRANSACTIONS}>
								<TabTransactions
									branchMachineId={branchMachine.id}
									serverUrl={branchMachine.server_url}
								/>
							</Tabs.TabPane>

							<Tabs.TabPane
								key={tabs.DAILY_INVOICE_REPORT}
								tab={tabs.DAILY_INVOICE_REPORT}
							>
								<TabDailyInvoiceReport
									branchMachineId={branchMachine.id}
									serverUrl={branchMachine.server_url}
								/>
							</Tabs.TabPane>

							<Tabs.TabPane
								key={tabs.DAILY_PRODUCT_SALES_REPORT}
								tab={tabs.DAILY_PRODUCT_SALES_REPORT}
							>
								<TabDailyProductSalesReport
									branchMachineId={branchMachine.id}
									serverUrl={branchMachine.server_url}
								/>
							</Tabs.TabPane>

							<Tabs.TabPane
								key={tabs.TRANSACTION_ADJUSTMENTS_REPORT}
								tab={tabs.TRANSACTION_ADJUSTMENTS_REPORT}
							>
								<TabTransactionAdjustmentReport
									branchMachineId={branchMachine.id}
									serverUrl={branchMachine.server_url}
								/>
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.BIR_REPORT} tab={tabs.BIR_REPORT}>
								<TabBirReport
									branchMachineId={branchMachine.id}
									serverUrl={branchMachine.server_url}
								/>
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.SESSIONS} tab={tabs.SESSIONS}>
								<TabSessions serverUrl={branchMachine.server_url} />
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.DAYS} tab={tabs.DAYS}>
								<TabDays serverUrl={branchMachine.server_url} />
							</Tabs.TabPane>

							<Tabs.TabPane
								key={tabs.CONNECTIVITY_LOGS}
								tab={tabs.CONNECTIVITY_LOGS}
							>
								<TabConnectivityLogs serverUrl={branchMachine.server_url} />
							</Tabs.TabPane>
						</Tabs>
					)}
				</Box>
			</Spin>
		</Content>
	);
};
