/* eslint-disable react/no-unused-prop-types */
import { Layout, Spin } from 'antd';
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

export const Container = ({
	loading,
	loadingText,
	sidebarItems,
	children,
}: Props) => {
	const { user, retrieveUser } = useAuth();

	// useBeforeunload(() => {
	// 	logout(user.id);
	// });

	useEffect(() => {
		retrieveUser(
			user.id,
			IS_APP_LIVE ? user.online_login_count : user.login_count,
		);
	}, []);

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
