/* eslint-disable react/no-unused-prop-types */
import { Layout, notification, Spin } from 'antd';
import React, { ReactNode, useEffect } from 'react';
import { IS_APP_LIVE } from '../../../global/constants';
import { useAuth } from '../../../hooks/useAuth';
import { Sidebar } from '../Sidebar/Sidebar';
import './style.scss';

interface Props {
	title?: string;
	children?: ReactNode;
	loadingText?: string;
	loading?: boolean;
	description?: string;
	rightTitle?: string;
	breadcrumb?: ReactNode;
	sidebarItems?: any;
}

const SINGLE_SIGN_IN_WARNINGS_KEY = 'SINGLE_SIGN_IN_WARNINGS_KEY';

export const Container = ({
	loading,
	loadingText,
	sidebarItems,
	children,
}: Props) => {
	const { user, retrieveUser, updateUserActiveSessionCount } = useAuth();

	useEffect(() => {
		retrieveUser(
			user.id,
			IS_APP_LIVE ? user.online_login_count : user.login_count,
		);
	}, []);

	useEffect(() => {
		const activeSessionsCount = IS_APP_LIVE
			? user?.active_online_sessions_count
			: user?.active_sessions_count;

		if (activeSessionsCount > 1) {
			notification.warning({
				key: SINGLE_SIGN_IN_WARNINGS_KEY,
				duration: null,
				message: 'Account Notification',
				description: 'Someone else was using this account.',
			});

			updateUserActiveSessionCount(user, 1);
		}
	}, [user]);

	return (
		<Layout className="Container">
			<Spin
				wrapperClassName="Container_spinner"
				size="large"
				spinning={loading}
				tip={loadingText}
			>
				<Sidebar items={sidebarItems} />
				{children}
			</Spin>
		</Layout>
	);
};

Container.defaultProps = {
	loading: false,
	loadingText: 'Fetching data...',
};
