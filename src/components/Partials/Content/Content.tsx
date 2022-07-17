import { Layout, Tooltip } from 'antd';
import cn from 'classnames';
import { useUI } from 'hooks/useUI';
import React, { ReactNode } from 'react';
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
	// TODO: Temporarily disabled checking if has internet connection.
	// Restore this functionality once it is revisited and if still needed
	const { isSidebarCollapsed } = useUI();
	// const { hasInternetConnection, testConnection } = useNetwork();
	// const { pathname: pathName } = useLocation();

	// useEffect(() => {
	// 	testConnection();
	// }, []);

	// const isDisabled = useCallback(() => {
	// 	if (!hasInternetConnection) {
	// 		const path = pathName.split('/')?.[1];
	// 		return ONLINE_ROUTES.includes(`/${path}`);
	// 	}

	// 	return false;
	// }, [hasInternetConnection]);

	return (
		<Layout
			className={cn('ContentLayout', className, {
				ContentLayout__sidebarCollapsed: isSidebarCollapsed,
				// ContentLayout__disabled: isDisabled(),
			})}
		>
			<Layout.Header className="ContentLayout_header">
				<div>
					<h3 className="ContentLayout_header_title">
						{title}
						{description && (
							<Tooltip placement="right" title={description}>
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
