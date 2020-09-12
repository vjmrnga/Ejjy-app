import React from 'react';
import './styles.scss';
import cn from 'classnames';

interface Props {
	classNames?: any;
}

export const EmptyIcon = ({ classNames }: Props) => (
	<div className={cn('Icon', 'empty', classNames)}></div>
);

export const CheckIcon = ({ classNames }: Props) => (
	<div className={cn('Icon', 'primary', classNames)}>
		<img src={require('../../assets/images/icon-check-white.svg')} alt="icon" />
	</div>
);

export const ErrorIcon = ({ classNames }: Props) => (
	<div className={cn('Icon', 'error', classNames)}>
		<img src={require('../../assets/images/icon-x-white.svg')} alt="icon" />
	</div>
);

export const AddIcon = ({ classNames }: Props) => (
	<img
		src={require('../../assets/images/icon-add-white.svg')}
		width="16"
		alt="icon"
		className={classNames}
	/>
);
