import React, { ReactNode } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './style.scss';

interface IContainerProps {
	title: string;
	rightTitle?: string;
	breadcrumbs?: ReactNode;
	children?: ReactNode;
}

const Container = ({ title, rightTitle, breadcrumbs, children }: IContainerProps) => {
	return (
		<section className="Main">
			<Sidebar />
			<section className="Content">
				<section className="page-header">
					<div>
						<h3 className="page-title">{title}</h3>
						{breadcrumbs}
					</div>
					<h3 className="page-title">{rightTitle}</h3>
				</section>

				<section className="page-content">{children}</section>
			</section>
		</section>
	);
};

export default Container;
