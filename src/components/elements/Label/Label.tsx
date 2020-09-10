import cn from 'classnames';
import * as React from 'react';
import './style.scss';

interface Props {
	id?: string;
	label: string;
	spacing?: boolean;
}

const Label = ({ id, label: inputLabel, spacing }: Props) => (
	<label htmlFor={id} className={cn('Label', { spacing })}>
		{inputLabel}
	</label>
);

export default Label;
