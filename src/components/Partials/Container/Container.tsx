import { Layout, Tooltip } from 'antd';
import React, { ReactNode } from 'react';
import { InfoIcon } from '../../Icons/Icons';
import { Sidebar } from '../Sidebar/Sidebar';
import './style.scss';

const { Header, Content } = Layout;

interface Props {
	title: string;
	description?: string;
	rightTitle?: string;
	breadcrumb?: ReactNode;
	children?: ReactNode;
}

export const Container = ({ title, description, rightTitle, breadcrumb, children }: Props) => {
	return (
		<Layout className="Main">
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
						<h3 className="page-title">{rightTitle}</h3>
					</section>
				</Header>
				<Content className="page-content">{children}</Content>
			</Layout>
		</Layout>
	);
};
