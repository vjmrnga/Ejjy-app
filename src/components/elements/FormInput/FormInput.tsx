import cn from 'classnames';
import { Field } from 'formik';
import * as React from 'react';
import './style.scss';

export interface IInputProps {
	id?: string;
	type?: string;
	placeholder?: string;
	max?: number;
	min?: number;
	step?: string;
	withPesoSign?: boolean;
	disabled?: boolean;
	onBlur?: any;
}

const FormInput = ({
	id,
	type,
	placeholder,
	max,
	min,
	step,
	disabled,
	withPesoSign,
	onBlur,
}: IInputProps) => (
	<div className="FormInput">
		{withPesoSign && (
			<img
				className="FormInput_pesoSign"
				src={require('../../../assets/images/icon-peso.svg')}
			/>
		)}
		<Field
			type={type}
			id={id}
			name={id}
			className={cn('FormInput_input', {
				FormInput_input__withPesoSign: withPesoSign,
			})}
			placeholder={placeholder}
			max={max}
			min={min}
			step={step}
			disabled={disabled}
			onBlur={onBlur}
			onKeyDown={(evt) => {
				if (type === 'number' && ['e', 'E', '+', '-'].includes(evt.key)) {
					evt.preventDefault();
				}
			}}
		/>
	</div>
);

FormInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
	withPesoSign: false,
	onBlur: () => {},
};

export default FormInput;
