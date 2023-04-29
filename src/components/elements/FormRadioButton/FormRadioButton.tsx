import iconCheckWhite from 'assets/images/icon-check-white.svg';
import cn from 'classnames';
import { useField } from 'formik';
import * as React from 'react';
import './style.scss';

interface Item {
	id: string;
	label: string;
	value: string | boolean | number;
}

interface Props {
	id: string;
	items: Item[];
	disabled?: boolean;
	onChange?: any;
}

const FormRadioButton = ({ id, items, disabled, onChange }: Props) => {
	const [field, , helpers] = useField(id);

	return (
		<div className="FormRadioButton">
			{items.map(({ id: itemId, value, label }) => (
				<button
					key={itemId}
					className={cn('FormRadioButton_button', {
						FormRadioButton_button__disabled: disabled,
						FormRadioButton_button__checked: value === field.value,
						FormRadioButton_button__checked__disabled:
							value === field.value && disabled,
					})}
					type="button"
					onClick={() => {
						helpers.setValue(value);
						onChange?.(value);
					}}
				>
					<span>{label}</span>
					{value === field.value && (
						<img
							alt="check icon"
							className="FormRadioButton_button_checkIcon"
							src={iconCheckWhite}
						/>
					)}
				</button>
			))}
		</div>
	);
};

FormRadioButton.defaultProps = {
	disabled: false,
};

export default FormRadioButton;
