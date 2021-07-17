/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Layout, Tooltip } from 'antd';
import cn from 'classnames';
import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { ONLINE_ROUTES } from '../../../global/constants';
import { userTypes } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useNetwork } from '../../../hooks/useNetwork';
import { useUI } from '../../../hooks/useUI';
import { getUserTypeName } from '../../../utils/function';
import './style.scss';

interface Props {
	items?: any;
}

export const Sidebar = ({ items }: Props) => {
	// STATES
	const [popupVisible, setPopupVisible] = useState(false);

	// CUSTOM HOOKS
	const { pathname } = useLocation();
	const { user, logout } = useAuth();
	const { hasInternetConnection } = useNetwork();
	const { isSidebarCollapsed, onCollapseSidebar } = useUI();

	// METHODS
	const getName = useCallback(() => {
		const firstName =
			user.user_type === userTypes.ADMIN ? 'Emman' : user.first_name;
		const lastName =
			user.user_type === userTypes.ADMIN ? 'Fineza' : user.last_name;

		return `${firstName} ${lastName}`;
	}, [user]);

	// const getSidebarItems = useCallback(
	// 	() => [
	// 		{
	// 			key: 'dashboard',
	// 			name: 'Dashboard',
	// 			activeIcon: require('../../../assets/images/icon-dashboard-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-dashboard.svg'),
	// 			link: '/dashboard',
	// 			userTypes: [
	// 				userTypes.ADMIN,
	// 				userTypes.OFFICE_MANAGER,
	// 				userTypes.BRANCH_MANAGER,
	// 				userTypes.BRANCH_PERSONNEL,
	// 			],
	// 		},
	// 		{
	// 			key: 'pending-transactions',
	// 			name: 'Pending Transactions',
	// 			activeIcon: require('../../../assets/images/icon-failed-transfers-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-failed-transfers.svg'),
	// 			link: '/pending-transactions',
	// 			count: pendingTransactionsCount,
	// 			userTypes: [userTypes.ADMIN],
	// 		},
	// 		{
	// 			key: 'products',
	// 			name: 'Products',
	// 			activeIcon: require('../../../assets/images/icon-product-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-product.svg'),
	// 			link: '/products',
	// 			userTypes: [
	// 				userTypes.ADMIN,
	// 				userTypes.OFFICE_MANAGER,
	// 				userTypes.BRANCH_MANAGER,
	// 				userTypes.BRANCH_PERSONNEL,
	// 			],
	// 		},
	// 		{
	// 			key: 'branches',
	// 			name: 'Branches',
	// 			activeIcon: require('../../../assets/images/icon-branches-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-branches.svg'),
	// 			link: '/branches',
	// 			userTypes: [userTypes.ADMIN, userTypes.OFFICE_MANAGER],
	// 		},
	// 		{
	// 			key: 'logs',
	// 			name: 'Logs',
	// 			activeIcon: require('../../../assets/images/icon-requisition-slip-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-requisition-slip.svg'),
	// 			link: '/logs',
	// 			count: logsCount,
	// 			userTypes: [userTypes.ADMIN],
	// 		},
	// 		{
	// 			key: 'requisition-slips',
	// 			name: 'Requisition Slips',
	// 			activeIcon: require('../../../assets/images/icon-requisition-slip-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-requisition-slip.svg'),
	// 			link: '/requisition-slips',
	// 			userTypes: [userTypes.OFFICE_MANAGER, userTypes.BRANCH_MANAGER],
	// 		},
	// 		{
	// 			key: 'users',
	// 			name: 'Users',
	// 			activeIcon: require('../../../assets/images/icon-users-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-users.svg'),
	// 			link: '/users',
	// 			userTypes: [userTypes.OFFICE_MANAGER],
	// 		},
	// 		{
	// 			key: 'order-slips',
	// 			name: 'Order Slips',
	// 			activeIcon: require('../../../assets/images/icon-order-slips-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-order-slips.svg'),
	// 			link: '/order-slips',
	// 			userTypes: [userTypes.BRANCH_MANAGER],
	// 		},
	// 		{
	// 			key: 'preparation-slips',
	// 			name: 'Preparation Slips',
	// 			activeIcon: require('../../../assets/images/icon-order-slips-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-order-slips.svg'),
	// 			link: '/preparation-slips',
	// 			userTypes: [userTypes.BRANCH_PERSONNEL],
	// 		},
	// 		{
	// 			key: 'checking',
	// 			name: 'Checking',
	// 			activeIcon: require('../../../assets/images/icon-checking-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-checking.svg'),
	// 			link: '/checking',
	// 			userTypes: [userTypes.BRANCH_MANAGER],
	// 		},
	// 		{
	// 			key: 'reports',
	// 			name: 'Reports',
	// 			activeIcon: require('../../../assets/images/icon-report-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-report.svg'),
	// 			link: '/reports',
	// 			userTypes: [userTypes.OFFICE_MANAGER],
	// 		},
	// 		{
	// 			key: 'sales',
	// 			name: 'Sales',
	// 			activeIcon: require('../../../assets/images/icon-sales-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-sales.svg'),
	// 			link: '/sales',
	// 			userTypes: [userTypes.ADMIN],
	// 		},
	// 		{
	// 			key: 'notifications',
	// 			name: 'Notifications',
	// 			activeIcon: require('../../../assets/images/icon-notifications-active.svg'),
	// 			defaultIcon: require('../../../assets/images/icon-notifications.svg'),
	// 			link: '/notifications',
	// 			userTypes: [
	// 				userTypes.ADMIN,
	// 				userTypes.OFFICE_MANAGER,
	// 				userTypes.BRANCH_MANAGER,
	// 				userTypes.BRANCH_PERSONNEL,
	// 			],
	// 		},
	// 	],
	// 	[logsCount, pendingTransactionsCount],
	// );

	return (
		<Layout.Sider
			className={cn('Sidebar', { Sidebar__collapsed: isSidebarCollapsed })}
			theme="light"
			width={280}
			breakpoint="md"
			collapsedWidth="0"
			onCollapse={(collapsed) => onCollapseSidebar(collapsed)}
		>
			<img
				src={require('../../../assets/images/logo.jpg')}
				alt="logo"
				className="Sidebar_logo"
			/>
			<div className="Sidebar_sidebarList">
				{items.map((item) => (
					<Link tabIndex={-1} to={item.link} key={item.key}>
						<div
							className={cn('Sidebar_sidebarList_item', {
								active: pathname.startsWith(item.link),
							})}
						>
							<img src={item.defaultIcon} alt={item.name} className="icon" />
							<img
								src={item.activeIcon}
								alt={item.name}
								className="icon icon-active"
							/>
							<span className="name">{item.name}</span>

							{item?.count > 0 && (
								<span className="item-count">{item?.count}</span>
							)}

							{ONLINE_ROUTES.includes(item.link) && !hasInternetConnection && (
								<Tooltip title="Locked if no internet">
									<img
										src={require('../../../assets/images/icon-lock.svg')}
										alt={item.name}
										className="icon-lock"
									/>
								</Tooltip>
							)}
						</div>
					</Link>
				))}
			</div>

			<div
				className={cn('bottom', { active: popupVisible })}
				onClick={() => setPopupVisible((value) => !value)}
			>
				<div className="menu">
					<div className="item">
						<img
							src={require('../../../assets/images/icon-account.svg')}
							alt="icon"
							className="icon"
						/>
						<span className="name">Account</span>
					</div>

					<div className="item" onClick={() => logout(user.id)}>
						<img
							src={require('../../../assets/images/icon-logout.svg')}
							alt="icon"
							className="icon"
						/>
						<span className="name">Logout</span>
					</div>
				</div>

				<div className="user-details">
					<img
						src={require('../../../assets/images/sample-avatar.png')}
						alt="user avatar"
						className="avatar"
					/>
					<div className="user-text-info">
						<span className="name">{getName()}</span>
						<span className="role">{getUserTypeName(user.user_type)}</span>
					</div>
				</div>
			</div>
		</Layout.Sider>
	);
};
