import { Divider, Modal } from 'antd';
import { isInteger } from 'lodash';
import React, { useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { DetailsRow, DetailsSingle } from '../../../../components';
import {
	ControlledInput,
	FieldError,
	Label,
} from '../../../../components/elements';
import { KeyboardButton } from '../../../../components/KeyboardButton/KeyboardButton';
import { unitOfMeasurementTypes } from '../../../../global/types';
import { FULFILL_TYPES } from './constants';

interface Props {
	product: any;
	type: number;
	onSubmit: any;
	onClose: any;
}

export const FulfillSlipModal = ({
	product,
	type,
	onSubmit,
	onClose,
}: Props) => {
	// STATES
	const [quantity, setQuantity] = useState('');
	const [error, setError] = useState(null);

	// METHODS
	const onFulfill = () => {
		const quantityValue = Number(quantity);

		// Check if not empty
		if (quantity.length <= 0) {
			setError('Please input a valid quantity.');
			return;
		}

		// Check if non-weighing but decimal
		if (
			product?.unitOfMeasurement === unitOfMeasurementTypes.NON_WEIGHING &&
			!isInteger(quantityValue)
		) {
			setError('Non-weighing items require whole number quantity.');
			return;
		}

		// Check if positive value
		const newQuantity =
			Number(product.fulfilled) +
			(type === FULFILL_TYPES.ADD ? quantityValue : -quantityValue);

		if (newQuantity < 0) {
			setError('Total quantity must be greater than or equals to zero.');
			return;
		}

		onSubmit(product.id, newQuantity);
		close();
	};

	const handleKeyPress = (key) => {
		if (key === 'esc') {
			close();
		} else if (key === 'enter') {
			onFulfill();
		}
	};

	const close = () => {
		setQuantity('');
		onClose();
	};

	return (
		<Modal
			title={product?.name}
			className="FulfillSlipModal Modal__hasFooter"
			footer={null}
			onCancel={close}
			visible
			centered
			closable
		>
			<KeyboardEventHandler
				handleKeys={['enter', 'esc']}
				onKeyEvent={(key) => handleKeyPress(key)}
			>
				<div className="FulfillSlipModal_keyboardKeys">
					<KeyboardButton
						keyboardKey="Enter"
						label="Submit"
						onClick={onFulfill}
					/>
					<KeyboardButton keyboardKey="Esc" label="Exit" onClick={close} />
				</div>

				<Divider dashed />

				<DetailsRow>
					<DetailsSingle label="Ordered quantity" value={product?.ordered} />
					<DetailsSingle label="Current quantity" value={product?.fulfilled} />
				</DetailsRow>

				<div className="FulfillSlipModal_inputQuantity">
					<Label
						label={`${type === FULFILL_TYPES.ADD ? 'Add' : 'Deduct'} Quantity`}
						spacing
					/>
					<ControlledInput
						type="number"
						min={0}
						value={quantity}
						onChange={(value) => {
							setQuantity(value);
							setError(null);
						}}
						autoFocus
					/>
					{error && <FieldError error={error} />}
				</div>
			</KeyboardEventHandler>
		</Modal>
	);
};
