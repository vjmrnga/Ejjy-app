import { Layout, Tooltip } from 'antd';
import cn from 'classnames';
import React, { ReactNode, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router';
import { ONLINE_ROUTES } from '../../../global/constants';
import { useNetwork } from '../../../hooks/useNetwork';
import { useUI } from '../../../hooks/useUI';
import { InfoIcon } from '../../Icons/Icons';
import './style.scss';

interface Props {
	title: string;
	description?: string;
	rightTitle?: string;
	breadcrumb?: ReactNode;
	className?: string;
	children?: ReactNode;
}

export const Content = ({
	title,
	description,
	rightTitle,
	breadcrumb,
	className,
	children,
}: Props) => {
	const { isSidebarCollapsed } = useUI();
	const { hasInternetConnection, testConnection } = useNetwork();
	const { pathname: pathName } = useLocation();

	useEffect(() => {
		testConnection();
	}, []);

	const isDisabled = useCallback(() => {
		if (!hasInternetConnection) {
			const path = pathName.split('/')?.[1];
			return ONLINE_ROUTES.includes(`/${path}`);
		}

		return false;
	}, [hasInternetConnection]);

	return (
		<Layout
			className={cn('ContentLayout', className, {
				ContentLayout__sidebarCollapsed: isSidebarCollapsed,
				ContentLayout__disabled: isDisabled(),
			})}
		>
			<Layout.Header className="ContentLayout_header">
				<div>
					<h3 className="ContentLayout_header_title">
						{title}
						{description && (
							<Tooltip title={description} placement="right">
								<InfoIcon classNames="ContentLayout_header_title_iconInfo" />
								<span />
							</Tooltip>
						)}
					</h3>

					{breadcrumb}
				</div>
				<h3 className="ContentLayout_header_title">{rightTitle || ''}</h3>
			</Layout.Header>
			<Layout.Content className="ContentLayout_mainContent">
				{children}
			</Layout.Content>
		</Layout>
	);
};
