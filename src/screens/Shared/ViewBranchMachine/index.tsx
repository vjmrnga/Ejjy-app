import { Alert, message, Spin, Tabs } from 'antd';
import { Breadcrumb, Content, RequestErrors } from 'components';
import { Box } from 'components/elements';
import { GENERIC_ERROR_MESSAGE } from 'global';
import { useBranchMachineRetrieve, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { viewBranchTabs } from 'screens/Shared/Branches/data';
import { useUserStore } from 'stores';
import {
	convertIntoArray,
	getUrlPrefix,
	isUserFromBranch,
	isUserFromOffice,
} from 'utils';
import { TabBirReport } from './components/TabBirReport';
import { TabDailyInvoiceReport } from './components/TabDailyInvoiceReport';
import { TabDailyProductSalesReport } from './components/TabDailyProductSalesReport';
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
};

export const ViewBranchMachine = ({ match }: Props) => {
	// VARIABLES
	const branchMachineId = match?.params?.id;

	// CUSTOM HOOKS
	const {
		params: { tab },
		setQueryParams,
	} = useQueryParams();
	const user = useUserStore((state) => state.user);
	const history = useHistory();
	const {
		data: branchMachine,
		isLoading: isLoadingBranchMachine,
		isFetched: isBranchMachineFetched,
		error: branchMachineError,
	} = useBranchMachineRetrieve({
		id: branchMachineId,
		options: {
			refetchInterval: 5000,
			refetchIntervalInBackground: true,
		},
	});

	// METHODS
	useEffect(() => {
		if (isBranchMachineFetched && !branchMachine) {
			history.replace(`/${getUrlPrefix(user.user_type)}/branch-machines`);
			message.error(GENERIC_ERROR_MESSAGE);
		}
	}, [branchMachine, isBranchMachineFetched]);

	const getBreadcrumbItems = useCallback(() => {
		const breadcrumbItems = [
			{
				name: 'Branch Machines',
				link: `${getUrlPrefix(user.user_type)}/branch-machines`,
			},
			{ name: branchMachine?.name },
		];

		if (isUserFromOffice(user.user_type)) {
			breadcrumbItems.unshift({
				name: 'Branches',
				link: `${getUrlPrefix(user.user_type)}/branches`,
			});
			breadcrumbItems[1].link = `${getUrlPrefix(user.user_type)}/branches/${
				branchMachine?.branch?.id
			}?tab=${viewBranchTabs.MACHINES}`;
		}

		return breadcrumbItems;
	}, [branchMachine, user]);

	const handleTabClick = (selectedTab) => {
		setQueryParams(
			{ tab: selectedTab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
			rightTitle={branchMachine?.name}
			title="[VIEW] Branch Machine"
		>
			<Spin spinning={isLoadingBranchMachine}>
				{isUserFromBranch(user.user_type) &&
					branchMachine?.is_online === false && (
						<Alert
							className="mb-4"
							description="The branch machine is offline. Data might be outdated."
							message="Branch Machine Connectivity"
							type="warning"
							showIcon
						/>
					)}

				<Box className="ViewBranchMachine">
					{branchMachineError && (
						<div className="pa-6 pb-0">
							<RequestErrors errors={convertIntoArray(branchMachineError)} />
						</div>
					)}

					{branchMachine?.server_url && (
						<Tabs
							activeKey={_.toString(tab) || tabs.TRANSACTIONS}
							className="pa-6"
							type="card"
							destroyInactiveTabPane
							onTabClick={handleTabClick}
						>
							<Tabs.TabPane key={tabs.TRANSACTIONS} tab={tabs.TRANSACTIONS}>
								<TabTransactions branchMachineId={branchMachine.id} />
							</Tabs.TabPane>

							<Tabs.TabPane
								key={tabs.DAILY_INVOICE_REPORT}
								tab={tabs.DAILY_INVOICE_REPORT}
							>
								<TabDailyInvoiceReport branchMachineId={branchMachine.id} />
							</Tabs.TabPane>

							<Tabs.TabPane
								key={tabs.DAILY_PRODUCT_SALES_REPORT}
								tab={tabs.DAILY_PRODUCT_SALES_REPORT}
							>
								<TabDailyProductSalesReport
									branchMachineId={branchMachine.id}
								/>
							</Tabs.TabPane>

							<Tabs.TabPane
								key={tabs.TRANSACTION_ADJUSTMENTS_REPORT}
								tab={tabs.TRANSACTION_ADJUSTMENTS_REPORT}
							>
								<TabTransactionAdjustmentReport
									branchMachineId={branchMachine.id}
								/>
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.BIR_REPORT} tab={tabs.BIR_REPORT}>
								<TabBirReport branchMachineId={branchMachine.id} />
							</Tabs.TabPane>
						</Tabs>
					)}
				</Box>
			</Spin>
		</Content>
	);
};
