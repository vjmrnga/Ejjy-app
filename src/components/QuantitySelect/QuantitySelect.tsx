import React from 'react';
import { quantityTypeOptions, quantityTypes } from '../../global/variables';
import { Select } from '../elements';
import './style.scss';

interface Props {
	onQuantityTypeChange: any;
}

export const QuantitySelect = ({ onQuantityTypeChange }: Props) => {
	return (
		<div className="QuantitySelect">
			<span>Quantity</span>
			<Select
				classNames="quantity-select"
				options={quantityTypeOptions}
				placeholder="quantity"
				defaultValue={quantityTypes.PIECE}
				onChange={(event) => onQuantityTypeChange(event.target.value)}
			/>
		</div>
	);
};
