import { Layout } from 'antd';
import cn from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { userTypes } from '../../../global/variables';
import './style.scss';
import { selectors } from '../../../ducks/auth';

const SidebarItems = [
	{
		key: 'dashboard',
		name: 'Dashboard',
		activeIcon: require(`../../../assets/images/icon-dashboard-active.svg`),
		defaultIcon: require(`../../../assets/images/icon-dashboard.svg`),
		link: '/dashboard',
		userTypes: [userTypes.OFFICE_MANAGER, userTypes.BRANCH_MANAGER],
	},
	{
		key: 'products',
		name: 'Products',
		activeIcon: require(`../../../assets/images/icon-product-active.svg`),
		defaultIcon: require(`../../../assets/images/icon-product.svg`),
		link: '/products',
		userTypes: [userTypes.OFFICE_MANAGER, userTypes.BRANCH_MANAGER],
	},
	{
		key: 'branches',
		name: 'Branches',
		activeIcon: require(`../../../assets/images/icon-branches-active.svg`),
		defaultIcon: require(`../../../assets/images/icon-branches.svg`),
		link: '/branches',
		userTypes: [userTypes.OFFICE_MANAGER],
	},
	{
		key: 'purchase-requests',
		name: 'Purchase Requests',
		activeIcon: require(`../../../assets/images/icon-transaction-active.svg`),
		defaultIcon: require(`../../../assets/images/icon-transaction.svg`),
		link: '/purchase-requests',
		userTypes: [userTypes.OFFICE_MANAGER, userTypes.BRANCH_MANAGER],
	},
	{
		key: 'users',
		name: 'Users',
		activeIcon: require(`../../../assets/images/icon-users-active.svg`),
		defaultIcon: require(`../../../assets/images/icon-users.svg`),
		link: '/users',
		userTypes: [userTypes.OFFICE_MANAGER],
	},
	{
		key: 'order-slips',
		name: 'Order Slips',
		activeIcon: require(`../../../assets/images/icon-order-slips-active.svg`),
		defaultIcon: require(`../../../assets/images/icon-order-slips.svg`),
		link: '/order-slips',
		userTypes: [userTypes.BRANCH_MANAGER],
	},
	{
		key: 'notifications',
		name: 'Notifications',
		activeIcon: require(`../../../assets/images/icon-notifications-active.svg`),
		defaultIcon: require(`../../../assets/images/icon-notifications.svg`),
		link: '/notifications',
		userTypes: [userTypes.OFFICE_MANAGER, userTypes.BRANCH_MANAGER],
	},
];

export const Sidebar = () => {
	const { pathname } = useLocation();
	const user = useSelector(selectors.selectUser());

	return (
		<Layout.Sider theme="light" breakpoint="md" collapsedWidth="0" className="Sidebar">
			<img src={require('../../../assets/images/logo.jpg')} alt="logo" className="logo" />
			<div className="sidebar-items">
				{SidebarItems.filter((item) => item.userTypes.includes(user.user_type)).map((item) => (
					<Link to={item.link} key={item.key}>
						<div className={cn('item', { active: pathname === item.link })}>
							<img src={item.defaultIcon} alt={item.name} className="icon" />
							<img src={item.activeIcon} alt={item.name} className="icon icon-active" />
							<span className="name">{item.name}</span>
						</div>
					</Link>
				))}
			</div>

			<div className="user-details">
				<img
					src={require('../../../assets/images/sample-avatar.png')}
					alt="user avatar"
					className="avatar"
				/>
				<div>
					<span className="name">Emman Jae</span>
					<span className="role">Superadmin</span>
				</div>
			</div>
		</Layout.Sider>
	);
};
