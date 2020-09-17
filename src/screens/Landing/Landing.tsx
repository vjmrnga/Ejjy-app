/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-fallthrough */
import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { useBranches } from '../OfficeManager/hooks/useBranches';
import { selectors } from '../../ducks/auth';
import './style.scss';
import { useSelector } from 'react-redux';
import { request, userTypes } from '../../global/variables';
import { useHistory } from 'react-router-dom';

const Landing = () => {
	const history = useHistory();

	const user = useSelector(selectors.selectUser());
	const { getBranches, status: getBranchesStatus } = useBranches();

	useEffect(() => {
		if (user) {
			switch (user?.user_type) {
				case userTypes.OFFICE_MANAGER: {
					getBranches();
				}
				case userTypes.BRANCH_MANAGER: {
				}
				case userTypes.BRANCH_PERSONNEL: {
				}
			}
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			if (getBranchesStatus === request.SUCCESS) {
				history.replace('/dashboard');
			}
		}
	}, [user, getBranchesStatus]);

	return (
		<section className="Landing">
			<Spin size="large" tip="Fetching data..." />
		</section>
	);
};

export default Landing;
