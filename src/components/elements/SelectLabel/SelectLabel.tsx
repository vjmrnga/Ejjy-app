import * as React from 'react';
import Label from '../Label/Label';
import Select, { ISelectProps } from '../Select/Select';

interface Props extends ISelectProps {
	label: string;
}

const SelectLabel = ({ id, label: inputLabel, options, placeholder, disabled }: Props) => (
	<>
		<Label id={id} label={inputLabel} spacing />
		<Select id={id} placeholder={placeholder} options={options} disabled={disabled} />
	</>
);

export default SelectLabel;
