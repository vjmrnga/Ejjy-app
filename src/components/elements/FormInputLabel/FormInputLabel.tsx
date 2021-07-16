import * as React from 'react';
import FormInput, { IInputProps } from '../FormInput/FormInput';
import Label from '../Label/Label';

interface Props extends IInputProps {
	label: string;
}

const FormInputLabel = ({
	id,
	type,
	label: inputLabel,
	placeholder,
	max,
	min,
	step,
	disabled,
	isMoney,
}: Props) => (
	<>
		<Label id={id} label={inputLabel} spacing />
		<FormInput
			type={type}
			id={id}
			max={max}
			min={min}
			step={step}
			placeholder={placeholder}
			disabled={disabled}
			isMoney={isMoney}
		/>
	</>
);

export default FormInputLabel;
