import React from 'react';
import './styles.scss';
import cn from 'classnames';

interface IIconsProps {
	classNames?: any;
}

export const CheckIcon = ({ classNames }: IIconsProps) => (
	<div className={cn('Icon', 'primary', classNames)}>
		<img src={require('../../assets/images/icon-check-white.svg')} alt="icon" />
	</div>
);

export const ErrorIcon = ({ classNames }: IIconsProps) => (
	<div className={cn('Icon', 'error', classNames)}>
		<img src={require('../../assets/images/icon-x-white.svg')} alt="icon" />
	</div>
);
