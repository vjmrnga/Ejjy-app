import { Divider, message, Modal } from 'antd';
import React, { useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { DetailsRow, DetailsSingle } from '../../../../components';
import { ControlledInput, Label } from '../../../../components/elements';
import { KeyboardButton } from '../../../../components/KeyboardButton/KeyboardButton';
import { FULFILL_TYPES } from './constants';

interface Props {
	product: any;
	type: number;
	visible: boolean;
	onSubmit: any;
	onClose: any;
}

export const FulfillSlipModal = ({
	product,
	type,
	visible,
	onSubmit,
	onClose,
}: Props) => {
	// STATES
	const [quantity, setQuantity] = useState('');

	// METHODS
	const onFulfill = () => {
		const quantityValue = Number(quantity);

		if (!quantity.length || !(quantityValue > 0)) {
			message.error('Please input a valid quantity.');
			return;
		}

		const newQuantity =
			product.fulfilled +
			(type === FULFILL_TYPES.ADD ? quantityValue : -quantityValue);

		if (newQuantity < 0) {
			message.error('Total quantity must be greater than or equals to zero.');
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
			className="FulfillSlipModal"
			visible={visible}
			footer={null}
			onCancel={close}
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
						onChange={(value) => setQuantity(value)}
						autoFocus
					/>
				</div>
			</KeyboardEventHandler>
		</Modal>
	);
};
