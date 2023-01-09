import { Descriptions, Divider, Modal } from 'antd';
import { Button, Label } from 'components/elements';
import { SHOW_HIDE_SHORTCUT } from 'global';
import React, { useEffect, useState } from 'react';
import {
	confirmPassword,
	formatInPeso,
	formatQuantity,
	getKeyDownCombination,
} from 'utils';

interface Props {
	visible: boolean;
	branchName: string;
	branchProduct: any;
	onClose: any;
}

export const ViewBranchProductModal = ({
	branchProduct,
	branchName,
	visible,
	onClose,
}: Props) => {
	// VARIABLES
	const title = (
		<>
			<span>[View] Branch Product</span>
			<span className="ModalTitleMainInfo">{branchName}</span>
		</>
	);

	// STATES
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (SHOW_HIDE_SHORTCUT.includes(key) && visible) {
			event.preventDefault();
			if (isCurrentBalanceVisible) {
				setIsCurrentBalanceVisible(false);
			} else {
				confirmPassword({
					onSuccess: () => setIsCurrentBalanceVisible(true),
				});
			}
		}
	};

	const handleClose = () => {
		setIsCurrentBalanceVisible(false);
		onClose();
	};

	return (
		<Modal
			className="ViewBranchProductModal Modal__large Modal__hasFooter"
			footer={[<Button key="button" text="Close" onClick={handleClose} />]}
			title={title}
			visible={visible}
			centered
			closable
			onCancel={handleClose}
		>
			{branchProduct && (
				<Descriptions column={1} bordered>
					<Descriptions.Item label="Barcode">
						{branchProduct.product.barcode}
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

					<Divider dashed>
						<Label label="Quantity" />
					</Divider>

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
					{isCurrentBalanceVisible && (
						<Descriptions.Item label="Current Balance">
							{formatQuantity({
								unitOfMeasurement: branchProduct.product.unit_of_measurement,
								quantity: branchProduct.current_balance,
							})}
						</Descriptions.Item>
					)}

					<Divider dashed>
						<Label label="MONEY" />
					</Divider>

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
			)}
		</Modal>
	);
};
