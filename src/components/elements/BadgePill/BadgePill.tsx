import cn from 'classnames';
import * as React from 'react';
import './style.scss';

interface Props {
	label: string;
	variant?: 'primary' | 'secondary' | 'error' | 'orange' | 'yellow';
	classNames?: any;
}

const BadgePill = ({ label, variant, classNames }: Props) => (
	<p className={cn('BadgePill', variant, classNames)}>{label}</p>
);

BadgePill.defaultProps = {
	variant: 'default',
};

export default BadgePill;
