import cn from 'classnames';
import React from 'react';
import './style.scss';

export type ColoredTextVariant = 'default' | 'primary' | 'secondary' | 'error';

interface Props {
	text: string;
	variant?: ColoredTextVariant;
	size?: 'default' | 'small' | string;
}

export const ColoredText = ({ text, variant, size }: Props) => (
	<span
		className={cn('ColoredText', {
			[`ColoredText___${variant}`]: variant,
			[`ColoredText___${size}`]: size,
		})}
	>
		{text}
	</span>
);

ColoredText.defaultProps = {
	variant: 'default',
	size: 'default',
};
