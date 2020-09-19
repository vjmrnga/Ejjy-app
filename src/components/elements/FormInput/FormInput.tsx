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

const FormInput = ({ type, id, max, min, placeholder, disabled }: IInputProps) => (
	<Field
		type={type}
		id={id}
		name={id}
		className="FormInput"
		placeholder={placeholder}
		max={max}
		min={min}
		disabled={disabled}
	/>
);

FormInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default FormInput;
