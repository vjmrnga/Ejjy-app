import { message, Spin, Tabs } from 'antd';
import { useQueryParams } from 'hooks';
import { toString } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { TabDailyProductSalesReport } from 'screens/BranchManager/BranchMachines/components/TabDailyProductSalesReport';
import { Breadcrumb, Content, RequestErrors } from '../../../components';
import { Box } from '../../../components/elements';
import { GENERIC_ERROR_MESSAGE } from '../../../global/constants';
import { request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useBranchMachines } from '../../../hooks/useBranchMachines';
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
	SESSIONS: 'Sessions',
	DAYS: 'Days',
	CONNECTIVITY_LOGS: 'Connectivity Logs',
};

export const ViewBranchMachine = ({ match }: Props) => {
	// VARIABLES
	const branchMachineId = match?.params?.id;

	// STATES
	const [branchMachine, setBranchMachine] = useState(null);

	// CUSTOM HOOKS
	const {
		params: { tab: currentTab },
		setQueryParams,
	} = useQueryParams();
	const { user } = useAuth();
	const history = useHistory();
	const {
		getBranchMachine,
		status: branchMachineStatus,
		errors: branchMachineErrors,
	} = useBranchMachines();

	// METHODS

	useEffect(() => {
		if (!currentTab) {
			onTabClick(tabs.TRANSACTIONS);
		}

		getBranchMachine(branchMachineId, ({ status, data }) => {
			if (status === request.SUCCESS) {
				setBranchMachine(data);
			} else if (status === request.ERROR) {
				history.replace(`/branch-manager/branch-machines`);
				message.error(GENERIC_ERROR_MESSAGE);
			}
		});
	}, []);

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
			<Spin spinning={branchMachineStatus === request.REQUESTING}>
				<Box className="ViewBranchMachine">
					{branchMachineErrors.length > 0 && (
						<div className="PaddingVertical PaddingHorizontal">
							<RequestErrors errors={convertIntoArray(branchMachineErrors)} />
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
