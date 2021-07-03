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
	step?: string;
}

const FormInput = ({
	type,
	id,
	max,
	min,
	placeholder,
	step,
	disabled,
}: IInputProps) => (
	<Field
		type={type}
		id={id}
		name={id}
		className="FormInput"
		placeholder={placeholder}
		max={max}
		min={min}
		step={step}
		disabled={disabled}
		onKeyDown={(evt) => {
			if (type === 'number' && ['e', 'E', '+', '-'].includes(evt.key)) {
				evt.preventDefault();
			}
		}}
	/>
);

FormInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default FormInput;
