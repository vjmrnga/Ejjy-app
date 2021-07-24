import { Checkbox } from 'antd';
import { useField } from 'formik';
import * as React from 'react';
import './style.scss';

interface Props {
	id: string;
	label?: string;
	onChange?: any;
}

const FormCheckbox = ({ id, label, onChange }: Props) => {
	const [field, , helpers] = useField(id);

	const onChangeField = (e) => {
		helpers.setValue(e.target.checked);

		onChange?.(e.target.checked);
	};

	return (
		<Checkbox checked={field.value} onChange={onChangeField}>
			{label}
		</Checkbox>
	);
};

export default FormCheckbox;
