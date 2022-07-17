/* eslint-disable jsx-a11y/no-autofocus */
import * as React from 'react';
import './style.scss';
import cn from 'classnames';

interface Props {
	id?: string;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	max?: number;
	min?: number;
	onChange: any;
	autoFocus?: boolean;
	classNames?: any;
}

const UncontrolledInput = ({
	classNames,
	type,
	id,
	max,
	min,
	placeholder,
	onChange,
	disabled,
	autoFocus,
}: Props) => (
	<input
		autoFocus={autoFocus}
		className={cn('Input', classNames)}
		disabled={disabled}
		id={id}
		max={max}
		min={min}
		name={id}
		placeholder={placeholder}
		type={type}
		onChange={(event) => onChange(event.target.value)}
	/>
);

UncontrolledInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default UncontrolledInput;
