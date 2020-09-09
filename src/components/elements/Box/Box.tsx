import * as React from 'react';
import './style.scss';
import cn from 'classnames';

interface Props {
	className?: string;
	children: any;
}

const Box = ({ children, className }: Props) => (
	<div className={cn('Box', className)}>{children}</div>
);

export default Box;
