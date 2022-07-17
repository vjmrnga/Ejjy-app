import React from 'react';
import './styles.scss';
import cn from 'classnames';

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
		<img alt="icon" src={require('../../assets/images/icon-check-white.svg')} />
	</div>
);

export const ErrorIcon = ({ classNames, size }: PropsWithWrapper) => (
	<div className={cn('Icon', 'error', classNames, size)}>
		<img alt="icon" src={require('../../assets/images/icon-x-white.svg')} />
	</div>
);

export const AddIcon = ({ classNames }: Props) => (
	<img
		alt="icon"
		className={classNames}
		src={require('../../assets/images/icon-add-white.svg')}
		width="16"
	/>
);

export const InfoIcon = ({ classNames }: Props) => (
	<img
		alt="icon"
		className={classNames}
		src={require('../../assets/images/icon-info.svg')}
	/>
);
