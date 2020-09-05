import * as React from 'react';
import Input, { IInputProps } from '../Input/Input';
import './style.scss';

interface IInputLabelProps extends IInputProps {
	label: string;
}

const InputLabel = ({ id, label: inputLabel, type, placeholder }: IInputLabelProps) => (
	<>
		<label htmlFor={id} className="Label">
			{inputLabel}
		</label>
		<Input type={type} id={id} placeholder={placeholder} />
	</>
);

export default InputLabel;
