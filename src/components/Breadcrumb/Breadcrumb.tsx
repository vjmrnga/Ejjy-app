import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

interface Step {
	name: string;
	link?: string;
}

interface Props {
	items: Step[];
}

export const Breadcrumb = ({ items }: Props) => (
	<div className="Breadcrumb">
		{items.map(({ name, link }, index) => (
			<div key={`${name}-${index}`} className="item">
				{index === items.length - 1 ? (
					<span className="last">{name}</span>
				) : (
					<div className="link-icon-container">
						<Link to={link}>{name}</Link>
						<img
							alt="breadcrumb divider"
							className="divider"
							src={require('../../assets/images/icon-breadcrumb-divider.svg')}
						/>
					</div>
				)}
			</div>
		))}
	</div>
);
