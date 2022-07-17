import * as React from 'react';
import Label from '../Label/Label';
import Textarea, { ITextareaProps } from '../FormTextarea/FormTextarea';

interface Props extends ITextareaProps {
	label: string;
}

const FormTextareaLabel = ({
	id,
	label: inputLabel,
	placeholder,
	disabled,
}: Props) => (
	<>
		<Label id={id} label={inputLabel} spacing />
		<Textarea disabled={disabled} id={id} placeholder={placeholder} />
	</>
);

export default FormTextareaLabel;
