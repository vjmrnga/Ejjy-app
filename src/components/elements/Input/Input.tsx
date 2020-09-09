import { Field } from 'formik';
import * as React from 'react';
import './style.scss';

export interface IInputProps {
	id?: string;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	max?: number;
	min?: number;
}

const Input = ({ type, id, max, min, placeholder, disabled }: IInputProps) => (
	<Field
		type={type}
		id={id}
		name={id}
		className="Input"
		placeholder={placeholder}
		max={max}
		min={min}
		disabled={disabled}
	/>
);

Input.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default Input;
