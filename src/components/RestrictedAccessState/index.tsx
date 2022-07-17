import React from 'react';
import './style.scss';

interface Props {
	title: string;
	description: string;
	icon?: any;
}

export const RestrictedAccessState = ({ title, description, icon }: Props) => (
	<div className="RestrictedAccessState">
		{icon || (
			<img
				alt="icon"
				className="RestrictedAccessState_icon"
				src={require('../../assets/images/icon-danger.svg')}
			/>
		)}

		<p className="RestrictedAccessState_title">{title}</p>
		<p className="RestrictedAccessState_description">{description}</p>
	</div>
);

RestrictedAccessState.defaultProps = {
	icon: null,
};
