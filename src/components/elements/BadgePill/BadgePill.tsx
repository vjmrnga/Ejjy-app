import cn from 'classnames';
import * as React from 'react';
import './style.scss';

export interface IBadgePillProps {
	label: string;
	variant?: 'primary' | 'secondary' | 'error';
	classNames?: any;
}

const BadgePill = ({ label, variant, classNames }: IBadgePillProps) => {
	return <p className={cn('BadgePill', variant, classNames)}>{label}</p>;
};

BadgePill.defaultProps = {
	variant: 'default',
};

export default BadgePill;
