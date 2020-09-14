import { Field, FieldProps } from 'formik';
import * as React from 'react';
import './style.scss';

interface Props {
	id: string;
}

const FormCheckbox = ({ id }: Props) => (
	<Field
		name={id}
		render={({ field }: FieldProps) => (
			<div className="FormCheckbox">
				<label>
					<input id={id} {...field} type="checkbox" checked={field.value} />
					<span></span>
				</label>
			</div>
		)}
	/>
);

export default FormCheckbox;
