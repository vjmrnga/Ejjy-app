import { Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { Content, RequestErrors } from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { useProductCategories } from '../../../hooks/useProductCategories';
import { convertIntoArray } from '../../../utils/function';
import { ReportsBranch } from './components/ReportsBranch';
import './style.scss';

export const Reports = () => {
	// STATES
	const [currentActiveKey, setCurrentActiveKey] = useState(null);
	const [productCategories, setProductCategories] = useState([]);

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
		<Content className="Reports" title="Reports">
			<Box>
				<Spin
					size="large"
					spinning={productCategoriesStatus === request.REQUESTING}
				>
					<RequestErrors
						errors={convertIntoArray(productCategoriesErrors)}
						withSpaceBottom
					/>

					<Tabs
						defaultActiveKey={branches?.[0]?.id}
						style={{ padding: '20px 25px' }}
						type="card"
						onTabClick={onTabClick}
					>
						{branches.map(({ name, id, online_url }) => (
							<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
								<ReportsBranch
									isActive={id === Number(currentActiveKey)}
									branchId={id}
									productCategories={productCategories}
								/>
							</Tabs.TabPane>
						))}
					</Tabs>
				</Spin>
			</Box>
		</Content>
	);
};
