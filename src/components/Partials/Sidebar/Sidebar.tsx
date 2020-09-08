import cn from 'classnames';
import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import './style.scss';

const SidebarItems = [
	{
		name: 'Dashboard',
		activeIcon: require(`../../../assets/images/icon-dashboard-active.svg`),
		defaultIcon: require(`../../../assets/images/icon-dashboard.svg`),
		link: '/dashboard',
	},
	{
		name: 'Product',
		activeIcon: require(`../../../assets/images/icon-product-active.svg`),
		defaultIcon: require(`../../../assets/images/icon-product.svg`),
		link: '/product',
	},
	{
		name: 'Transaction',
		activeIcon: require(`../../../assets/images/icon-transaction-active.svg`),
		defaultIcon: require(`../../../assets/images/icon-transaction.svg`),
		link: '/transaction',
	},
	{
		name: 'Logout',
		activeIcon: require(`../../../assets/images/icon-logout-active.svg`),
		defaultIcon: require(`../../../assets/images/icon-logout.svg`),
		link: '/logout',
	},
];

const Sidebar = () => {
	const { pathname } = useLocation();

	return (
		<section className="Sidebar">
			<img src={require('../../../assets/images/logo.svg')} alt="logo" className="logo" />

			<div className="sidebar-items">
				{SidebarItems.map((item) => (
					<Link to={item.link}>
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
		</section>
	);
};

export default Sidebar;
