import { Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { Content, RequestErrors } from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { useProductCategories } from '../../../hooks/useProductCategories';
import { convertIntoArray } from '../../../utils/function';
import { BranchBalanceItem } from './components/BranchBalanceItem';
import './style.scss';

export const Dashboard = () => {
	// STATES
	const [productCategories, setProductCategories] = useState([]);
	const [currentActiveKey, setCurrentActiveKey] = useState(null);

	// CUSTOM HOOKS
	const { branches } = useBranches();
	const {
		getProductCategories,
		status: productCategoriesStatus,
		errors: productCategoriesErrors,
	} = useProductCategories();

	// METHODS
	useEffect(() => {
		getProductCategories(({ status, data: responseData }) => {
			if (status === request.SUCCESS) {
				setProductCategories(responseData);
			}
		});
	}, []);

	useEffect(() => {
		if (branches) {
			onTabClick(branches?.[0]?.id);
		}
	}, [branches]);

	const onTabClick = (branchId) => {
		setCurrentActiveKey(branchId);
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
						defaultActiveKey={branches?.[0]?.id}
						type="card"
						onTabClick={onTabClick}
					>
						{branches.map(({ name, id, online_url }) => (
							<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
								<BranchBalanceItem
									branchId={id}
									productCategories={productCategories}
									isActive={id === Number(currentActiveKey)}
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
