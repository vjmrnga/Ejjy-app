import { Button, Descriptions, Divider, Modal } from 'antd';
import { SHOW_HIDE_SHORTCUT } from 'global';
import React, { useEffect, useState } from 'react';
import {
	confirmPassword,
	formatInPeso,
	formatQuantity,
	getKeyDownCombination,
} from 'utils';

interface Props {
	isCurrentBalanceVisible: boolean;
	branchProduct: any;
	onClose: any;
}

export const ViewBranchProductModal = ({
	branchProduct,
	isCurrentBalanceVisible,
	onClose,
}: Props) => {
	// STATES
	const [isBalanceVisible, setIsBalanceVisible] = useState(
		isCurrentBalanceVisible,
	);

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (SHOW_HIDE_SHORTCUT.includes(key)) {
			event.preventDefault();
			if (isBalanceVisible) {
				setIsBalanceVisible(false);
			} else {
				confirmPassword({
					onSuccess: () => setIsBalanceVisible(true),
				});
			}
		}
	};

	return (
		<Modal
			className="Modal__large Modal__hasFooter"
			footer={<Button onClick={onClose}>Close</Button>}
			title={
				<>
					<span>[View] Branch Product</span>
					<span className="ModalTitleMainInfo">
						{branchProduct.product.name}
					</span>
				</>
			}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Descriptions
				column={1}
				labelStyle={{ width: '300px' }}
				size="small"
				bordered
			>
				<Descriptions.Item label="Barcode">
					{branchProduct.product.barcode}
				</Descriptions.Item>
				<Descriptions.Item label="Scale Barcode">
					{branchProduct.product.selling_barcode}
				</Descriptions.Item>
				<Descriptions.Item label="Packing Barcode">
					{branchProduct.product.packing_barcode}
				</Descriptions.Item>
				<Descriptions.Item label="Textcode">
					{branchProduct.product.textcode}
				</Descriptions.Item>
				<Descriptions.Item label="Name">
					{branchProduct.product.name}
				</Descriptions.Item>
				<Descriptions.Item label="Checking">
					{branchProduct.is_daily_checked ? 'Daily' : 'Random'}
				</Descriptions.Item>
				<Descriptions.Item label="Include In Scale">
					{branchProduct.is_shown_in_scale_list ? 'Yes' : 'No'}
				</Descriptions.Item>
				<Descriptions.Item label="In Stock">
					{branchProduct.is_sold_in_branch ? 'Yes' : 'No'}
				</Descriptions.Item>
			</Descriptions>

			<Divider dashed>Quantity</Divider>

			<Descriptions
				column={1}
				labelStyle={{ width: '300px' }}
				size="small"
				bordered
			>
				<Descriptions.Item label="Reorder PointID">
					{branchProduct.reorder_point}
				</Descriptions.Item>
				<Descriptions.Item label="Max Balance">
					{formatQuantity({
						unitOfMeasurement: branchProduct.product.unit_of_measurement,
						quantity: branchProduct.max_balance,
					})}
				</Descriptions.Item>
				<Descriptions.Item label="Allowable Spoilage (%)">
					{branchProduct.allowable_spoilage * 100}
				</Descriptions.Item>
				{isBalanceVisible && (
					<Descriptions.Item label="Current Balance">
						{formatQuantity({
							unitOfMeasurement: branchProduct.product.unit_of_measurement,
							quantity: branchProduct.current_balance,
						})}
					</Descriptions.Item>
				)}
			</Descriptions>

			<Divider dashed>Money</Divider>

			<Descriptions
				column={1}
				labelStyle={{ width: '300px' }}
				size="small"
				bordered
			>
				<Descriptions.Item label="Price (Piece)">
					{formatInPeso(branchProduct.price_per_piece)}
				</Descriptions.Item>
				<Descriptions.Item label="Wholesale Price (piece)">
					{formatInPeso(branchProduct.markdown_price_per_piece1)}
				</Descriptions.Item>
				<Descriptions.Item label="Special Price (piece)">
					{formatInPeso(branchProduct.markdown_price_per_piece2)}
				</Descriptions.Item>
				<Descriptions.Item label="Price (Bulk)">
					{formatInPeso(branchProduct.price_per_bulk)}
				</Descriptions.Item>
				<Descriptions.Item label="Wholesale Price (bulk)">
					{formatInPeso(branchProduct.markdown_price_per_bulk1)}
				</Descriptions.Item>
				<Descriptions.Item label="Special Price (Bulk)">
					{formatInPeso(branchProduct.markdown_price_per_bulk2)}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};
