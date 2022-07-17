import * as React from 'react';
import './style.scss';

interface Props {
	id?: string;
	placeholder?: string;
	disabled?: boolean;
	onChange: any;
}

const Textarea = ({ id, placeholder, onChange, disabled }: Props) => (
	<textarea
		className="Textarea"
		disabled={disabled}
		id={id}
		name={id}
		placeholder={placeholder}
		onChange={(event) => onChange(event.target.value)}
	/>
);

Textarea.defaultProps = {
	placeholder: '',
	disabled: false,
};

export default Textarea;
