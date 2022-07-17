import cn from 'classnames';
import * as React from 'react';
import './style.scss';

interface Props {
	id?: string;
	label: string | React.ReactNode;
	spacing?: boolean;
	classNames?: string;
}

const Label = ({ id, label: inputLabel, spacing, classNames }: Props) => (
	<label
		className={cn('Label', classNames, { Label___spacing: spacing })}
		htmlFor={id}
	>
		{inputLabel}
	</label>
);

export default Label;
