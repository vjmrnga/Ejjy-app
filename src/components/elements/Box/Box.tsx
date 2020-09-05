import * as React from 'react';
import './style.scss';
import cn from 'classnames';

interface IBoxProps {
	className?: string;
	children: any;
}

const Box = ({ children, className }: IBoxProps) => (
	<div className={cn('Box', className)}>{children}</div>
);

export default Box;
