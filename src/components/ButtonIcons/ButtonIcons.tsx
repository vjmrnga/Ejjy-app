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
		classNames={classNames}
		disabled={disabled}
		icon={<img alt="icon" src={imgSrc} />}
		tooltip={tooltip}
		type={type}
		onClick={onClick}
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
		classNames={classNames}
		disabled={disabled}
		icon={<img alt="icon" src={imgSrc} />}
		tooltip={tooltip}
		type={type}
		onClick={onClick}
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
		classNames={classNames}
		disabled={disabled}
		icon={<img alt="icon" src={imgSrc} />}
		tooltip={tooltip}
		type={type}
		onClick={onClick}
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
		classNames={classNames}
		disabled={disabled}
		icon={<img alt="icon" src={imgSrc} />}
		tooltip={tooltip}
		type={type}
		onClick={onClick}
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
		classNames={classNames}
		disabled={disabled}
		icon={<img alt="icon" src={imgSrc} />}
		tooltip={tooltip}
		type={type}
		onClick={onClick}
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
		classNames={classNames}
		disabled={disabled}
		icon={<img alt="icon" src={imgSrc} />}
		tooltip={tooltip}
		type={type}
		onClick={onClick}
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
		classNames={classNames}
		disabled={disabled}
		icon={<img alt="icon" src={imgSrc} />}
		tooltip={tooltip}
		type={type}
		onClick={onClick}
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
		classNames={classNames}
		disabled={disabled}
		icon={<img alt="icon" src={imgSrc} />}
		tooltip={tooltip}
		type={type}
		onClick={onClick}
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
		classNames={classNames}
		disabled={disabled}
		icon={<img alt="icon" src={imgSrc} />}
		tooltip={tooltip}
		type={type}
		onClick={onClick}
	/>
);
