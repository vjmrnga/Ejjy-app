import { notification, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IS_APP_LIVE } from '../../global/constants';
import { request, userTypes } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
import { useBranches } from '../../hooks/useBranches';
import './style.scss';

const Landing = () => {
	const history = useHistory();

	const { user } = useAuth();
	const { getBranches, status: getBranchesStatus } = useBranches();

	useEffect(() => {
		if (user) {
			const activeSessionsCount = IS_APP_LIVE
				? user?.active_online_sessions_count
				: user?.active_sessions_count;

			if (activeSessionsCount > 1) {
				notification.warning({
					duration: null,
					message: 'Account Notification',
					description: 'Someone else was using this account.',
				});
			}

			switch (user?.user_type) {
				case userTypes.OFFICE_MANAGER: {
					getBranches();
					break;
				}
				case userTypes.BRANCH_MANAGER: {
					if (IS_APP_LIVE) {
						getBranches();
					}
					break;
				}
				case userTypes.BRANCH_PERSONNEL: {
					if (IS_APP_LIVE) {
						getBranches();
					}
					break;
				}
				default:
					break;
			}
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			switch (user?.user_type) {
				case userTypes.ADMIN: {
					history.replace('dashboard');
					break;
				}
				case userTypes.OFFICE_MANAGER: {
					redirectOfficeManager();
					break;
				}
				case userTypes.BRANCH_MANAGER: {
					redirectBranchManager();
					break;
				}
				case userTypes.BRANCH_PERSONNEL: {
					redirectBranchPersonel();
					history.replace('dashboard');
					break;
				}
				default:
					break;
			}
		}
	}, [user, getBranchesStatus]);

	const redirectOfficeManager = () => {
		const requests = [getBranchesStatus];

		if (requests.includes(request.REQUESTING)) {
			// Do nothing
		} else if (requests.every((value) => value === request.SUCCESS)) {
			history.replace('dashboard');
		} else if (requests.some((value) => value === request.ERROR)) {
			// logout(user?.id);
		}
	};

	const redirectBranchManager = () => {
		if (!IS_APP_LIVE) {
			history.replace('dashboard');
			return;
		}

		const requests = [getBranchesStatus];

		if (requests.includes(request.REQUESTING)) {
			// Do nothing
		} else if (requests.every((value) => value === request.SUCCESS)) {
			history.replace('dashboard');
		} else if (requests.some((value) => value === request.ERROR)) {
			// logout(user?.id);
		}
	};

	const redirectBranchPersonel = () => {
		if (!IS_APP_LIVE) {
			history.replace('dashboard');
			return;
		}

		const requests = [getBranchesStatus];

		if (requests.includes(request.REQUESTING)) {
			// Do nothing
		} else if (requests.every((value) => value === request.SUCCESS)) {
			history.replace('dashboard');
		} else if (requests.some((value) => value === request.ERROR)) {
			// logout(user?.id);
		}
	};

	return (
		<section className="Landing">
			<Spin size="large" tip="Fetching data..." />
		</section>
	);
};

export default Landing;
