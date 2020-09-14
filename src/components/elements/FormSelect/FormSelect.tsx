import { Field } from 'formik';
import * as React from 'react';
import './style.scss';
import cn from 'classnames';

export interface Option {
	value: string;
	name: string;
	selected?: true | false;
}

export interface ISelectProps {
	id: string;
	placeholder?: string;
	disabled?: boolean;
	options: Option[];
}

const FormSelect = ({ id, options, placeholder, disabled }: ISelectProps) => (
	<Field
		as="select"
		id={id}
		name={id}
		className={cn('FormSelect', { disabled })}
		disabled={disabled}
	>
		{placeholder && (
			<option value="" selected disabled>
				{placeholder}
			</option>
		)}
		{options.map(({ name, value, selected = false }) => (
			<option selected={selected} value={value}>
				{name}
			</option>
		))}
	</Field>
);

FormSelect.defaultProps = {
	disabled: false,
};

export default FormSelect;
