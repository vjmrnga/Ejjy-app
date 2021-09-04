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
	imgSrc = require('../../assets/images/icon-add.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const EditButtonIcon = ({
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-edit.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const RemoveButtonIcon = ({
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-remove.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const ViewButtonIcon = ({
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-view.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const DeliverButtonIcon = ({
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-deliver.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const CancelButtonIcon = ({
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-cancel.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const FetchButtonIcon = ({
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-download.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const RestoreButtonIcon = ({
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-undo.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const CheckButtonIcon = ({
	type,
	tooltip,
	imgSrc = require('../../assets/images/icon-check-antd.svg'),
	onClick,
	classNames,
}: Props) => (
	<ButtonIcon
		type={type}
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);
