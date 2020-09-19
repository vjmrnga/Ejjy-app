import { Field } from 'formik';
import * as React from 'react';
import './style.scss';
import cn from 'classnames';

export interface ITextareaProps {
	id?: string;
	placeholder?: string;
	disabled?: boolean;
}

const FormTextarea = ({ id, placeholder, disabled }: ITextareaProps) => (
	<Field
		as="textarea"
		id={id}
		name={id}
		className={cn('FormTextarea', { disabled })}
		placeholder={placeholder}
		disabled={disabled}
	/>
);

FormTextarea.defaultProps = {
	placeholder: '',
	disabled: false,
};

export default FormTextarea;
