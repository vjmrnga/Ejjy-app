import * as React from 'react';
import './style.scss';
import cn from 'classnames';

interface Props {
	className?: string;
	padding?: boolean;
	children: any;
}

const Box = ({ children, padding, className }: Props) => (
	<div className={cn('Box', { padding }, className)}>{children}</div>
);

export default Box;
