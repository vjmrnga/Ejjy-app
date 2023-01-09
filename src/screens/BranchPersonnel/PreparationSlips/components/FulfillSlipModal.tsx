import { Descriptions, Divider, Modal } from 'antd';
import { KeyboardButton } from 'components';
import { ControlledInput, FieldError, Label } from 'components/elements';
import { unitOfMeasurementTypes } from 'global';
import { isInteger } from 'lodash';
import React, { useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
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
	const handleFulfill = () => {
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
			handleFulfill();
		}
	};

	const close = () => {
		setQuantity('');
		onClose();
	};

	return (
		<Modal
			className="FulfillSlipModal Modal__hasFooter"
			footer={null}
			title={product?.name}
			centered
			closable
			visible
			onCancel={close}
		>
			<KeyboardEventHandler
				handleKeys={['enter', 'esc']}
				onKeyEvent={(key) => handleKeyPress(key)}
			>
				<div className="FulfillSlipModal_keyboardKeys">
					<KeyboardButton
						keyboardKey="Enter"
						label="Submit"
						onClick={handleFulfill}
					/>
					<KeyboardButton keyboardKey="Esc" label="Exit" onClick={close} />
				</div>

				<Divider dashed />

				<Descriptions column={1} bordered>
					<Descriptions.Item label="Ordered quantity">
						{product?.ordered}
					</Descriptions.Item>
					<Descriptions.Item label="Current quantity">
						{product?.fulfilled}
					</Descriptions.Item>
				</Descriptions>

				<div className="FulfillSlipModal_inputQuantity">
					<Label
						label={`${type === FULFILL_TYPES.ADD ? 'Add' : 'Deduct'} Quantity`}
						spacing
					/>
					<ControlledInput
						min={0}
						type="number"
						value={quantity}
						autoFocus
						onChange={(value) => {
							setQuantity(value);
							setError(null);
						}}
					/>
					{error && <FieldError error={error} />}
				</div>
			</KeyboardEventHandler>
		</Modal>
	);
};
