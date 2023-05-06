import React, { ReactNode } from 'react';
import { formatInPeso } from 'utils';

interface Props {
	value: number;
	prefix?: string | ReactNode;
	postfix?: string | ReactNode;
}

export const ReceiptUnderlinedValue = ({ value, prefix, postfix }: Props) => (
	<span
		style={{
			display: 'inline-block',
			borderBottom: Number(value) > 0 ? '2px dashed black' : 'unset',
		}}
	>
		{prefix}
		{formatInPeso(value)}
		{postfix}
	</span>
);
