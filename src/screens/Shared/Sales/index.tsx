import { Spin, Tabs } from 'antd';
import { Content, RequestErrors, SalesInfo } from 'components';
import { Box } from 'components/elements';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, userTypes } from 'global';
import { useAuth, useBranches, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { convertIntoArray, getLocalBranchId } from 'utils';
import { BranchSales } from './components/BranchSales';

export const Sales = () => {
	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		data: { branches },
		isFetching: isFetchingBranches,
		error: branchesErrors,
	} = useBranches({
		options: {
			enabled: user.user_type === userTypes.OFFICE_MANAGER,
		},
	});

	// VARIABLES
	const {
		params: { branchId: currentBranchId },
		setQueryParams,
	} = useQueryParams();

	// METHODS
	useEffect(() => {
		if (branches && !currentBranchId) {
			handleTabClick(branches?.[0]?.id);
		}
	}, [branches, currentBranchId]);

	const handleTabClick = (branchId) => {
		setQueryParams({
			branchId,
			page: DEFAULT_PAGE,
			pageSize: DEFAULT_PAGE_SIZE,
		});
	};

	return (
		<Content title="Sales">
			<SalesInfo />

			<Box padding={user.user_type === userTypes.BRANCH_MANAGER}>
				{user.user_type === userTypes.OFFICE_MANAGER && (
					<Spin spinning={isFetchingBranches}>
						<RequestErrors
							className="px-6 pt-6"
							errors={convertIntoArray(branchesErrors, 'Branches')}
						/>

						<Tabs
							activeKey={_.toString(currentBranchId)}
							className="pa-6"
							type="card"
							destroyInactiveTabPane
							onTabClick={handleTabClick}
						>
							{branches.map(({ name, id }) => (
								<Tabs.TabPane key={id} tab={name}>
									<BranchSales branchId={id} />
								</Tabs.TabPane>
							))}
						</Tabs>
					</Spin>
				)}

				{user.user_type === userTypes.BRANCH_MANAGER && (
					<BranchSales branchId={getLocalBranchId()} />
				)}
			</Box>
		</Content>
	);
};
