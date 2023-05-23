import React, { ReactNode } from 'react';
import { formatInPeso } from 'utils';

interface Props {
	value: number;
	prefix?: string | ReactNode;
	postfix?: string | ReactNode;
}

export const ReceiptUnderlinedValue = ({ value, prefix, postfix }: Props) => (
	<>
		<span style={{ display: 'inline-block' }}>
			{prefix}
			{formatInPeso(value)}
			{postfix}
		</span>

		{Number(value) > 0 && (
			<div className="w-100" style={{ textAlign: 'right', lineHeight: 0.2 }}>
				-----------
			</div>
		)}
	</>
);
