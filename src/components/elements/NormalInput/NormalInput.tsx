import * as React from 'react';
import './style.scss';

export interface INormalInputProps {
	id?: string;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	max?: number;
	min?: number;
	onChange: any;
}

const NormalInput = ({
	type,
	id,
	max,
	min,
	placeholder,
	onChange,
	disabled,
}: INormalInputProps) => (
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

NormalInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default NormalInput;
