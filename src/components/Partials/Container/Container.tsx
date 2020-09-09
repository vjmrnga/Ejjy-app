import { Layout } from 'antd';
import React, { ReactNode } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './style.scss';

const { Header, Content } = Layout;

interface Props {
	title: string;
	rightTitle?: string;
	breadcrumbs?: ReactNode;
	children?: ReactNode;
}

const Container = ({ title, rightTitle, breadcrumbs, children }: Props) => {
	return (
		<Layout className="Main">
			<Sidebar />
			<Layout className="site-layout">
				<Header className="site-layout-background">
					<section className="page-header">
						<div>
							<h3 className="page-title">{title}</h3>
							{breadcrumbs}
						</div>
						<h3 className="page-title">{rightTitle}</h3>
					</section>
				</Header>
				<Content className="page-content">{children}</Content>
			</Layout>
		</Layout>
	);
};

export default Container;
