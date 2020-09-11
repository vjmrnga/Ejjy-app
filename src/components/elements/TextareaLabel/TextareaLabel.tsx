import * as React from 'react';
import Label from '../Label/Label';
import Textarea, { ITextareaProps } from '../Textarea/Textarea';

interface Props extends ITextareaProps {
	label: string;
}

const TextareaLabel = ({ id, label: inputLabel, placeholder, disabled }: Props) => (
	<>
		<Label id={id} label={inputLabel} spacing />
		<Textarea id={id} placeholder={placeholder} disabled={disabled} />
	</>
);

export default TextareaLabel;
