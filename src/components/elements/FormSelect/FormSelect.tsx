import cn from 'classnames';
import { useField } from 'formik';
import * as React from 'react';
import './style.scss';

export interface Option {
	value: string;
	name: string;
	selected?: true | false;
}

export interface ISelectProps {
	id: string;
	options: Option[];
	placeholder?: string;
	onChange?: any;
	disabled?: boolean;
}

const FormSelect = ({
	id,
	options,
	placeholder,
	onChange,
	disabled,
}: ISelectProps) => {
	const [field, , helpers] = useField(id);

	const onChangeField = (event) => {
		const { value } = event.target;
		helpers.setValue(value);
		onChange?.(value);
	};

	return (
		<select
			{...field}
			className={cn('FormSelect', { FormSelect__disabled: disabled })}
			id={id}
			name={id}
			disabled={disabled}
			onChange={onChangeField}
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
		</select>
	);
};

FormSelect.defaultProps = {
	disabled: false,
};

export default FormSelect;
