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
}

const FormRadioButton = ({ id, items, disabled }: Props) => {
	const [field, meta, helpers] = useField(id);

	return (
		<div className="FormRadioButton">
			{items.map(({ id, value, label }) => (
				<button
					type="button"
					className={cn('FormRadioButton_button', {
						FormRadioButton_button__disabled: disabled,
						FormRadioButton_button__checked: value === field.value,
						FormRadioButton_button__checked__disabled:
							value === field.value && disabled,
					})}
					key={id}
					onClick={() => helpers.setValue(value)}
				>
					<span>{label}</span>
					{value === field.value && (
						<img
							className="FormRadioButton_button_checkIcon"
							src={require('../../../assets/images/icon-check-white.svg')}
							alt="check icon"
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
