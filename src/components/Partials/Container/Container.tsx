import { Layout, Spin, Tooltip } from 'antd';
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { InfoIcon } from '../../Icons/Icons';
import { Sidebar } from '../Sidebar/Sidebar';
import './style.scss';
import { selectors as uiSelectors } from '../../../ducks/ui';
import cn from 'classnames';

const { Header, Content } = Layout;

interface Props {
	title: string;
	description?: string;
	rightTitle?: string;
	breadcrumb?: ReactNode;
	children?: ReactNode;
	loadingText?: string;
	loading?: boolean;
}

export const Container = ({
	title,
	description,
	rightTitle,
	breadcrumb,
	loading,
	loadingText,
	children,
}: Props) => {
	const isSidebarCollapsed = useSelector(uiSelectors.selectIsSidebarCollapsed());

	return (
		<Layout className={cn('Main', { 'sidebar-collapsed': isSidebarCollapsed })}>
			<Spin size="large" spinning={loading} tip={loadingText} className="container-spinner">
				<Sidebar />
				<Layout className="site-layout">
					<Header className="site-layout-background">
						<section className="page-header">
							<div>
								<h3 className="page-title">
									{title}
									{description && (
										<Tooltip title={description} placement="right">
											<InfoIcon classNames="icon-info" />
											<span></span>
										</Tooltip>
									)}
								</h3>

								{breadcrumb}
							</div>
							<h3 className="page-title">{rightTitle || ''}</h3>
						</section>
					</Header>
					<Content className="page-content">{children}</Content>
				</Layout>
			</Spin>
		</Layout>
	);
};

Container.defaultProps = {
	loading: false,
	loadingText: 'Fetching data...',
};
