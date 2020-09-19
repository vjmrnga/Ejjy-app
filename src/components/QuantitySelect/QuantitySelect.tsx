import React from 'react';
import { quantityTypeOptions } from '../../global/options';
import { quantityTypes } from '../../global/types';
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
				value={quantityTypes.PIECE}
				onChange={onQuantityTypeChange}
			/>
		</div>
	);
};
