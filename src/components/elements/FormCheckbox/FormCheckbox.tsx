/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
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
					<span />
				</label>
			</div>
		)}
	/>
);

export default FormCheckbox;
