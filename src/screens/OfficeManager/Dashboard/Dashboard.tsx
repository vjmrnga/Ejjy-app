import { Spin, Tabs } from 'antd';
import { toString } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Content, RequestErrors } from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { useProductCategories } from '../../../hooks/useProductCategories';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { convertIntoArray } from '../../../utils/function';
import { BranchBalanceItem } from './components/BranchBalanceItem';
import './style.scss';

export const Dashboard = () => {
	// STATES
	const [productCategories, setProductCategories] = useState([]);

	// CUSTOM HOOKS
	const { branches } = useBranches();
	const {
		getProductCategories,
		status: productCategoriesStatus,
		errors: productCategoriesErrors,
	} = useProductCategories();

	// VARIABLES
	const {
		params: { branchId: currentBranchId },
		setQueryParams,
	} = useQueryParams();

	// METHODS
	useEffect(() => {
		getProductCategories(({ status, data: responseData }) => {
			if (status === request.SUCCESS) {
				setProductCategories(responseData);
			}
		});
	}, []);

	useEffect(() => {
		if (branches && !currentBranchId) {
			onTabClick(branches?.[0]?.id);
		}
	}, [branches, currentBranchId]);

	const onTabClick = (branchId) => {
		setQueryParams({
			branchId,
			page: 1,
			pageSize: 10,
		});
	};

	return (
		<Content className="Dashboard" title="Dashboard">
			<Box padding>
				<Spin spinning={productCategoriesStatus === request.REQUESTING}>
					<RequestErrors
						errors={convertIntoArray(productCategoriesErrors)}
						withSpaceBottom
					/>

					<Tabs
						type="card"
						activeKey={toString(currentBranchId)}
						onTabClick={onTabClick}
						destroyInactiveTabPane
					>
						{branches.map(({ name, id, online_url }) => (
							<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
								<BranchBalanceItem
									branchId={id}
									productCategories={productCategories}
									disabled={!online_url}
								/>
							</Tabs.TabPane>
						))}
					</Tabs>
				</Spin>
			</Box>
		</Content>
	);
};
