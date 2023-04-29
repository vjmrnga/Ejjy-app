import React from 'react';
import iconDanger from 'assets/images/icon-danger.svg';
import './style.scss';

interface Props {
	title: string;
	description: string;
	icon?: any;
}

export const RestrictedAccessState = ({ title, description, icon }: Props) => (
	<div className="RestrictedAccessState">
		{icon || (
			<img alt="icon" className="RestrictedAccessState_icon" src={iconDanger} />
		)}

		<p className="RestrictedAccessState_title">{title}</p>
		<p className="RestrictedAccessState_description">{description}</p>
	</div>
);

RestrictedAccessState.defaultProps = {
	icon: null,
};
