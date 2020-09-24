import cn from 'classnames';
import React from 'react';
import './style.scss';

export const coloredTextType = {
	DEFAULT: 'default',
	PRIMARY: 'primary',
	ERROR: 'error',
};

interface Props {
	text: string;
	type: string;
}

export const ColoredText = ({ text, type }: Props) => {
	return <span className={cn('ColoredText', type)}>{text}</span>;
};
