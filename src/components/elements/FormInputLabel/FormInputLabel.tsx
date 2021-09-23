import * as React from 'react';
import FormInput, { IInputProps } from '../FormInput/FormInput';
import Label from '../Label/Label';

interface Props extends IInputProps {
	label: string;
}

const FormInputLabel = (props: Props) => {
	const { id, label, ...inputProps } = props;

	return (
		<>
			<Label id={id} label={label} spacing />
			<FormInput id={id} {...inputProps} />
		</>
	);
};

export default FormInputLabel;
