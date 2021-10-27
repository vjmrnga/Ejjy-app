import React from 'react';
import { quantityTypeOptions } from '../../global/options';
import { quantityTypes } from '../../global/types';
import { Select } from '../elements';
import './style.scss';

interface Props {
	quantityText?: string;
	quantityValue?: string;
	onQuantityTypeChange: any;
}

export const QuantitySelect = ({
	quantityText,
	quantityValue,
	onQuantityTypeChange,
}: Props) => (
	<div className="QuantitySelect">
		<span className="QuantitySelect_label">{quantityText}</span>
		<Select
			classNames="QuantitySelect_select"
			options={quantityTypeOptions}
			placeholder="Quantity"
			value={quantityValue}
			onChange={onQuantityTypeChange}
		/>
	</div>
);

QuantitySelect.defaultProps = {
	quantityValue: quantityTypes.PIECE,
	quantityText: 'Quantity',
};
