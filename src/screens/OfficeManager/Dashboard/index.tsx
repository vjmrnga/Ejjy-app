import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { Divider, Spin, Tabs } from 'antd';
import { BranchDayAuthorization, Content, RequestErrors } from 'components';
import { Box } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	NOTIFICATION_INTERVAL_MS,
} from 'global';
import { useBranches, useProductCategories, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { BranchProductBalances } from 'screens/Shared/Dashboard/components/BranchProductBalances';
import { ReportsPerMachine } from 'screens/Shared/Dashboard/components/ReportsPerMachine';
import { convertIntoArray, getId } from 'utils';

export const Dashboard = () => {
	// CUSTOM HOOKS
	const {
		data: { branches },
		isLoading: isFetchingBranches,
		error: branchesErrors,
	} = useBranches({
		options: { refetchInterval: NOTIFICATION_INTERVAL_MS },
	});
	const {
		data: { productCategories },
		isFetching: isFetchingProductCategories,
		error: productCategoriesErrors,
	} = useProductCategories({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	// VARIABLES
	const {
		params: { branchId: currentBranchId },
		setQueryParams,
	} = useQueryParams();

	// METHODS
	useEffect(() => {
		if (branches && !currentBranchId) {
			const id = getId(branches?.[0]);
			handleTabClick(id);
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
		<Content title="Dashboard">
			<Box>
				<Spin spinning={isFetchingBranches || isFetchingProductCategories}>
					<RequestErrors
						className="px-6 pt-6"
						errors={[
							...convertIntoArray(branchesErrors, 'Branches'),
							...convertIntoArray(
								productCategoriesErrors,
								'Product Categories',
							),
						]}
					/>

					<Tabs
						activeKey={_.toString(currentBranchId)}
						className="pa-6"
						tabPosition="left"
						type="card"
						destroyInactiveTabPane
						onTabClick={handleTabClick}
					>
						{branches.map((branch) => {
							const id = getId(branch);

							return (
								<Tabs.TabPane
									key={id}
									tab={
										<>
											{branch.is_online ? (
												<CheckCircleFilled style={{ color: '#20bf6b' }} />
											) : (
												<ExclamationCircleFilled style={{ color: '#fc5c65' }} />
											)}

											<span>{branch.name}</span>
										</>
									}
								>
									<BranchDayAuthorization
										branch={branch}
										className="mt-2"
										bordered
									/>

									<Divider />

									<ReportsPerMachine
										branchId={branch.id}
										tableHeaderClassName="pt-2 px-0"
									/>

									<Divider />

									<BranchProductBalances
										branchId={branch.id}
										productCategories={productCategories}
										tableHeaderClassName="pt-2 px-0"
									/>
								</Tabs.TabPane>
							);
						})}
					</Tabs>
				</Spin>
			</Box>
		</Content>
	);
};
