/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Layout, Tooltip } from 'antd';
import cn from 'classnames';
import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { getUserTypeName } from 'utils';
import { ONLINE_ROUTES } from '../../../global/constants';
import { userTypes } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useNetwork } from '../../../hooks/useNetwork';
import { useUI } from '../../../hooks/useUI';
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

	return (
		<Layout.Sider
			breakpoint="md"
			className={cn('Sidebar', { Sidebar__collapsed: isSidebarCollapsed })}
			collapsedWidth="0"
			theme="light"
			width={280}
			onCollapse={(collapsed) => onCollapseSidebar(collapsed)}
		>
			<img
				alt="logo"
				className="Sidebar_logo"
				src={require('../../../assets/images/logo.jpg')}
			/>
			<div className="Sidebar_sidebarList">
				{items.map((item) => (
					<Link key={item.key} tabIndex={-1} to={item.link}>
						<div
							className={cn('Sidebar_sidebarList_item', {
								Sidebar_sidebarList_item__active: pathname.startsWith(
									item.link,
								),
							})}
						>
							<img
								alt={item.name}
								className="Sidebar_sidebarList_item_icon"
								src={item.defaultIcon}
							/>
							<img
								alt={item.name}
								className="Sidebar_sidebarList_item_icon Sidebar_sidebarList_item_icon__active"
								src={item.activeIcon}
							/>
							<span className="Sidebar_sidebarList_item_name">{item.name}</span>

							{item?.count > 0 && (
								<span className="Sidebar_sidebarList_item_itemCount">
									{item?.count}
								</span>
							)}

							{ONLINE_ROUTES.includes(item.link) && !hasInternetConnection && (
								<Tooltip title="Locked if no internet">
									<img
										alt={item.name}
										className="Sidebar_sidebarList_item_iconLock"
										src={require('../../../assets/images/icon-lock.svg')}
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
							alt="icon"
							className="icon"
							src={require('../../../assets/images/icon-account.svg')}
						/>
						<span className="name">Account</span>
					</div>

					<div className="item" onClick={() => logout(user.id)}>
						<img
							alt="icon"
							className="icon"
							src={require('../../../assets/images/icon-logout.svg')}
						/>
						<span className="name">Logout</span>
					</div>
				</div>

				<div className="user-details">
					<img
						alt="user avatar"
						className="avatar"
						src={require('../../../assets/images/sample-avatar.png')}
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
