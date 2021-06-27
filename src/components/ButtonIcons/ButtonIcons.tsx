import React from 'react';
import { ButtonIcon } from '../elements';

interface Props {
	type?: 'button' | 'submit' | 'reset';
	tooltip: string;
	onClick: any;
	imgSrc?: any;
	classNames?: any;
}

export const AddButtonIcon = ({
	type,
	tooltip,
	onClick,
	classNames,
	imgSrc = require('../../assets/images/icon-add.svg'),
}: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const EditButtonIcon = ({ type, tooltip, onClick, classNames }: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={require('../../assets/images/icon-edit.svg')} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const RemoveButtonIcon = ({ type, tooltip, onClick, classNames }: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={require('../../assets/images/icon-remove.svg')} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const ViewButtonIcon = ({ type, tooltip, onClick, classNames }: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={require('../../assets/images/icon-view.svg')} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const DeliverButtonIcon = ({ type, tooltip, onClick, classNames }: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={require('../../assets/images/icon-deliver.svg')} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const CancelButtonIcon = ({ type, tooltip, onClick, classNames }: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={require('../../assets/images/icon-cancel.svg')} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const FetchButtonIcon = ({ type, tooltip, onClick, classNames }: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={require('../../assets/images/icon-download.svg')} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);
