import cn from 'classnames';
import { useField } from 'formik';
import * as React from 'react';
import {
	formatMoney,
	numberWithCommas,
	removeCommas,
} from '../../../utils/function';
import './style.scss';

export interface IInputProps {
	id?: string;
	type?: string;
	placeholder?: string;
	max?: number;
	min?: number;
	step?: string;
	onChange?: any;
	isMoney?: boolean;
	isWholeNumber?: boolean;
	disabled?: boolean;
}

const FormInput = ({
	id,
	type,
	placeholder,
	max,
	min,
	step,
	onChange,
	isMoney,
	isWholeNumber,
	disabled,
}: IInputProps) => {
	const [field, , helpers] = useField(id);
	const inputRe = /^[0-9/.\b]+\.?$/g;

	const onChangeField = (event) => {
		let { value } = event.target;

		if (isMoney) {
			value = removeCommas(value);
			if (inputRe.test(value)) {
				value = numberWithCommas(value);
			}
		}

		helpers.setValue(value);
		onChange?.(value);
	};

	const onBlur = (event) => {
		let { value } = event.target;

		if (isMoney) {
			value = removeCommas(value);
			value = formatMoney(value);
			value = numberWithCommas(value);
		}

		helpers.setValue(value);
	};

	const onKeyDown = (event) => {
		const { key } = event;

		const isNumber = type === 'number' || isMoney;
		const allowedInNumberKeys = [
			'Backspace',
			'Tab',
			'ArrowRight',
			'ArrowLeft',
			'Enter',
		];

		if (isNumber) {
			// Disregard other keys
			if (allowedInNumberKeys.includes(key)) {
				return;
			}

			// Check for double period
			if (key === '.' && (field?.value?.match(/\./g) || []).length >= 1) {
				event.preventDefault();
			}

			// Not allowed mathematical notations
			if (['e', 'E', '+', '-'].includes(key) || /[a-zA-Z\s]+/g.test(key)) {
				event.preventDefault();
			}

			// Cannot input decimal if non-weighing
			if (isWholeNumber && key === '.') {
				event.preventDefault();
			}
		}
	};

	return (
		<div className="FormInput">
			{isMoney && (
				<img
					className="FormInput_pesoSign"
					src={require('../../../assets/images/icon-peso.svg')}
					alt="peso sign"
				/>
			)}
			<input
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...field}
				type={type}
				id={id}
				name={id}
				className={cn('FormInput_input', {
					FormInput_input__isMoney: isMoney,
				})}
				placeholder={placeholder}
				max={max}
				min={min}
				step={step}
				disabled={disabled}
				onChange={onChangeField}
				onBlur={onBlur}
				onKeyDown={onKeyDown}
			/>
		</div>
	);
};

FormInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
	isMoney: false,
	onBlur: () => {},
};

export default FormInput;
