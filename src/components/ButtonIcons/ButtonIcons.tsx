import React from 'react';
import { ButtonIcon } from '../elements';

interface Props {
	type?: 'button' | 'submit' | 'reset';
	tooltip: string;
	onClick: any;
	imgSrc?: any;
	classNames?: any;
	disabled?: boolean;
}

export const AddButtonIcon = ({
	disabled,
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-add.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		disabled={disabled}
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const EditButtonIcon = ({
	disabled,
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-edit.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		disabled={disabled}
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const RemoveButtonIcon = ({
	disabled,
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-remove.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		disabled={disabled}
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const ViewButtonIcon = ({
	disabled,
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-view.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		disabled={disabled}
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const DeliverButtonIcon = ({
	disabled,
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-deliver.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		disabled={disabled}
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const CancelButtonIcon = ({
	disabled,
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-cancel.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		disabled={disabled}
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const FetchButtonIcon = ({
	disabled,
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-download.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		disabled={disabled}
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const RestoreButtonIcon = ({
	disabled,
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-undo.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		disabled={disabled}
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const CheckButtonIcon = ({
	disabled,
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-check-antd.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		disabled={disabled}
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);
