/* eslint-disable react-hooks/exhaustive-deps */
import { notification, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { request, userTypes } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
import { useBranches } from '../OfficeManager/hooks/useBranches';
import { useBranchMachines } from '../OfficeManager/hooks/useBranchMachines';
import './style.scss';

const Landing = () => {
	const history = useHistory();

	const { user } = useAuth();
	const { getBranches, status: getBranchesStatus } = useBranches();
	const { getBranchMachines, status: getBranchMachinesStatus } = useBranchMachines();

	useEffect(() => {
		if (user) {
			if (user.login_count > 1) {
				notification.error({
					duration: null,
					message: 'Account Notification',
					description: 'Someone else was using this account.',
				});
			}

			switch (user?.user_type) {
				case userTypes.OFFICE_MANAGER: {
					getBranches({ withBranchProducts: false });
					getBranchMachines();
					break;
				}
				case userTypes.BRANCH_MANAGER: {
					break;
				}
				case userTypes.BRANCH_PERSONNEL: {
					break;
				}
			}
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			switch (user?.user_type) {
				case userTypes.ADMIN: {
					history.replace('/dashboard');
					break;
				}
				case userTypes.OFFICE_MANAGER: {
					redirectOfficeManager();
					break;
				}
				case userTypes.BRANCH_MANAGER: {
					history.replace('/dashboard');
					break;
				}
				case userTypes.BRANCH_PERSONNEL: {
					history.replace('/dashboard');
					break;
				}
			}
		}
	}, [user, getBranchesStatus, getBranchMachinesStatus]);

	const redirectOfficeManager = () => {
		const requests = [getBranchesStatus, getBranchMachinesStatus];

		if (requests.includes(request.REQUESTING)) {
			return;
		} else if (requests.every((value) => value === request.SUCCESS)) {
			history.replace('/dashboard');
		} else if (requests.some((value) => value === request.ERROR)) {
			history.replace('/404');
		}
	};

	return (
		<section className="Landing">
			<Spin size="large" tip="Fetching data..." />
		</section>
	);
};

export default Landing;
