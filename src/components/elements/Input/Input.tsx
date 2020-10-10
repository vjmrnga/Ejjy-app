import * as React from 'react';
import './style.scss';

interface Props {
	id?: string;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	max?: number;
	min?: number;
	onChange: any;
}

const Input = ({ type, id, max, min, placeholder, onChange, disabled }: Props) => (
	<input
		type={type}
		id={id}
		name={id}
		className="Input"
		placeholder={placeholder}
		max={max}
		min={min}
		disabled={disabled}
		onChange={(event) => onChange(event.target.value)}
	/>
);

Input.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default Input;
