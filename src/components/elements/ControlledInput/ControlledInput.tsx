import * as React from 'react';
import './style.scss';
import cn from 'classnames';

interface Props {
	id?: string;
	value: any;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	max?: number;
	min?: number;
	onChange: any;
	autoFocus?: boolean;
	classNames?: any;
}

const ControlledInput = ({
	classNames,
	type,
	id,
	max,
	min,
	placeholder,
	onChange,
	disabled,
	autoFocus,
	value,
}: Props) => (
	<input
		// eslint-disable-next-line jsx-a11y/no-autofocus
		autoFocus={autoFocus}
		className={cn('Input', classNames)}
		disabled={disabled}
		id={id}
		max={max}
		min={min}
		name={id}
		placeholder={placeholder}
		type={type}
		// eslint-disable-next-line jsx-a11y/no-autofocus
		value={value}
		onChange={(event) => onChange(event.target.value)}
	/>
);

ControlledInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default ControlledInput;
