import React from 'react';
import iconAdd from 'assets/images/icon-add.svg';
import iconCancel from 'assets/images/icon-cancel.svg';
import iconCheckAntd from 'assets/images/icon-check-antd.svg';
import iconDeliver from 'assets/images/icon-deliver.svg';
import iconDownload from 'assets/images/icon-download.svg';
import iconEdit from 'assets/images/icon-edit.svg';
import iconRemove from 'assets/images/icon-remove.svg';
import iconUndo from 'assets/images/icon-undo.svg';
import iconView from 'assets/images/icon-view.svg';
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
	imgSrc = iconAdd,
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
	imgSrc = iconEdit,
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
	imgSrc = iconRemove,
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
	imgSrc = iconView,
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
	imgSrc = iconDeliver,
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
	imgSrc = iconCancel,
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
	imgSrc = iconDownload,
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
	imgSrc = iconUndo,
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
	imgSrc = iconCheckAntd,
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
