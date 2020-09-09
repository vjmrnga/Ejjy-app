import * as React from 'react';
import Input, { IInputProps } from '../Input/Input';
import Label from '../Label/Label';
import './style.scss';

interface Props extends IInputProps {
	label: string;
}

const InputLabel = ({ id, label: inputLabel, type, max, min, placeholder, disabled }: Props) => (
	<>
		<Label id={id} label={inputLabel} spacing />
		<Input type={type} id={id} max={max} min={min} placeholder={placeholder} disabled={disabled} />
	</>
);

export default InputLabel;
