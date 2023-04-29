import iconAddWhite from 'assets/images/icon-add-white.svg';
import iconCheckWhite from 'assets/images/icon-check-white.svg';
import iconInfo from 'assets/images/icon-info.svg';
import iconXWhite from 'assets/images/icon-x-white.svg';
import cn from 'classnames';
import React from 'react';
import './styles.scss';

interface Props {
	classNames?: any;
}

interface PropsWithWrapper extends Props {
	size?: 'default' | 'small';
}

export const EmptyIcon = ({ classNames, size }: PropsWithWrapper) => (
	<div className={cn('Icon', 'empty', classNames, size)} />
);

export const CheckIcon = ({ classNames, size }: PropsWithWrapper) => (
	<div className={cn('Icon', 'primary', classNames, size)}>
		<img alt="icon" src={iconCheckWhite} />
	</div>
);

export const ErrorIcon = ({ classNames, size }: PropsWithWrapper) => (
	<div className={cn('Icon', 'error', classNames, size)}>
		<img alt="icon" src={iconXWhite} />
	</div>
);

export const AddIcon = ({ classNames }: Props) => (
	<img alt="icon" className={classNames} src={iconAddWhite} width="16" />
);

export const InfoIcon = ({ classNames }: Props) => (
	<img alt="icon" className={classNames} src={iconInfo} />
);
