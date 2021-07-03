import cn from 'classnames';
import React from 'react';
import './style.scss';

interface Props {
	value: string | number;
	classNames?: string;
}

export const Pending = ({ value, classNames }: Props) => (
	<p className={cn('Pending', classNames)}>
		Pending:
		{value}
	</p>
);
