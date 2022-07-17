import * as React from 'react';
import Label from '../Label/Label';
import Select, { ISelectProps } from '../FormSelect/FormSelect';

interface Props extends ISelectProps {
	label: string;
}

const FormSelectLabel = ({
	id,
	label: inputLabel,
	options,
	placeholder,
	disabled,
}: Props) => (
	<>
		<Label id={id} label={inputLabel} spacing />
		<Select
			disabled={disabled}
			id={id}
			options={options}
			placeholder={placeholder}
		/>
	</>
);

export default FormSelectLabel;
