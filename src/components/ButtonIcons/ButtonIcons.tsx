import React from 'react';
import { ButtonIcon } from '../elements';

interface Props {
	tooltip: string;
	onClick: any;
	imgSrc?: any;
	classNames?: any;
}

export const AddButtonIcon = ({
	tooltip,
	onClick,
	classNames,
	imgSrc = require('../../assets/images/icon-add.svg'),
}: Props) => (
	<ButtonIcon
		icon={<img src={imgSrc} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const EditButtonIcon = ({ tooltip, onClick, classNames }: Props) => (
	<ButtonIcon
		icon={<img src={require('../../assets/images/icon-edit.svg')} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const RemoveButtonIcon = ({ tooltip, onClick, classNames }: Props) => (
	<ButtonIcon
		icon={<img src={require('../../assets/images/icon-remove.svg')} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const ViewButtonIcon = ({ tooltip, onClick, classNames }: Props) => (
	<ButtonIcon
		icon={<img src={require('../../assets/images/icon-view.svg')} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const DeliverButtonIcon = ({ tooltip, onClick, classNames }: Props) => (
	<ButtonIcon
		icon={<img src={require('../../assets/images/icon-deliver.svg')} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);

export const CancelButtonIcon = ({ tooltip, onClick, classNames }: Props) => (
	<ButtonIcon
		icon={<img src={require('../../assets/images/icon-cancel.svg')} alt="icon" />}
		onClick={onClick}
		tooltip={tooltip}
		classNames={classNames}
	/>
);
