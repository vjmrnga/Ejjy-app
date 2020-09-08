import React from 'react';
import { ButtonIcon } from '../elements';

interface IButtonIconsProps {
	classNames?: any;
}

export const AddButtonIcon = ({ classNames }: IButtonIconsProps) => (
	<ButtonIcon
		icon={<img src={require('../../assets/images/icon-add.svg')} alt="icon" />}
		classNames={classNames}
	/>
);

export const EditButtonIcon = ({ classNames }: IButtonIconsProps) => (
	<ButtonIcon
		icon={<img src={require('../../assets/images/icon-edit.svg')} alt="icon" />}
		classNames={classNames}
	/>
);

export const RemoveButtonIcon = ({ classNames }: IButtonIconsProps) => (
	<ButtonIcon
		icon={<img src={require('../../assets/images/icon-remove.svg')} alt="icon" />}
		classNames={classNames}
	/>
);

export const ViewButtonIcon = ({ classNames }: IButtonIconsProps) => (
	<ButtonIcon
		icon={<img src={require('../../assets/images/icon-view.svg')} alt="icon" />}
		classNames={classNames}
	/>
);

export const DeliverButtonIcon = ({ classNames }: IButtonIconsProps) => (
	<ButtonIcon
		icon={<img src={require('../../assets/images/icon-deliver.svg')} alt="icon" />}
		classNames={classNames}
	/>
);
