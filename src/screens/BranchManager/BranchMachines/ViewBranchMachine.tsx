import { message, Spin, Tabs } from 'antd';
import { toString } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Breadcrumb, Content, RequestErrors } from '../../../components';
import { Box } from '../../../components/elements';
import { GENERIC_ERROR_MESSAGE } from '../../../global/constants';
import { request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useBranchMachines } from '../../../hooks/useBranchMachines';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { convertIntoArray, getUrlPrefix } from '../../../utils/function';
import { ViewBranchConnectivityLogs } from './components/ViewBranchConnectivityLogs';
import { ViewBranchDays } from './components/ViewBranchDays';
import { ViewBranchSessions } from './components/ViewBranchSessions';
import { ViewBranchTransactions } from './components/ViewBranchTransactions';
import './style.scss';

interface Props {
	match: any;
}

const tabs = {
	TRANSACTIONS: 'Transactions',
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
								<ViewBranchTransactions serverUrl={branchMachine.server_url} />
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.SESSIONS} tab={tabs.SESSIONS}>
								<ViewBranchSessions serverUrl={branchMachine.server_url} />
							</Tabs.TabPane>

							<Tabs.TabPane key={tabs.DAYS} tab={tabs.DAYS}>
								<ViewBranchDays serverUrl={branchMachine.server_url} />
							</Tabs.TabPane>

							<Tabs.TabPane
								key={tabs.CONNECTIVITY_LOGS}
								tab={tabs.CONNECTIVITY_LOGS}
							>
								<ViewBranchConnectivityLogs
									serverUrl={branchMachine.server_url}
								/>
							</Tabs.TabPane>
						</Tabs>
					)}
				</Box>
			</Spin>
		</Content>
	);
};
