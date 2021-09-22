import { Divider, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { DetailsRow, DetailsSingle } from '../../../../../components';
import { Button, Label } from '../../../../../components/elements';
import { SHOW_HIDE_SHORTCUT } from '../../../../../global/constants';
import {
	confirmPassword,
	formatQuantity,
	getKeyDownCombination,
	numberWithCommas,
} from '../../../../../utils/function';

interface Props {
	branchProduct: any;
	onClose: any;
}

export const ViewBranchProductModal = ({ branchProduct, onClose }: Props) => {
	// VARIABLES
	const title = (
		<>
			<span>[View] Branch Product</span>
			<span className="ModalTitleMainInfo">{branchProduct.product.name}</span>
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

		if (SHOW_HIDE_SHORTCUT.includes(key)) {
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
			title={title}
			footer={[<Button text="Close" onClick={handleClose} />]}
			onCancel={handleClose}
			visible
			centered
			closable
		>
			{branchProduct && (
				<DetailsRow>
					<DetailsSingle
						label="Barcode"
						value={branchProduct.product.barcode}
					/>
					<DetailsSingle
						label="Textcode"
						value={branchProduct.product.textcode}
					/>
					<DetailsSingle label="Name" value={branchProduct.product.name} />

					<DetailsSingle
						label="Checking"
						value={branchProduct.is_daily_checked ? 'Daily' : 'Random'}
					/>

					<DetailsSingle
						label="Include In Scale"
						value={branchProduct.is_shown_in_scale_list ? 'Yes' : 'No'}
					/>

					<DetailsSingle
						label="In Stock"
						value={branchProduct.is_sold_in_branch ? 'Yes' : 'No'}
					/>

					<Divider dashed>
						<Label label="Quantity" />
					</Divider>

					<DetailsSingle
						label="Reorder Point"
						value={branchProduct.reorder_point}
					/>
					<DetailsSingle
						label="Max Balance"
						value={formatQuantity(
							branchProduct.product.unit_of_measurement,
							branchProduct.max_balance,
						)}
					/>

					<DetailsSingle
						label="Allowable Spoilage (%)"
						value={branchProduct.allowable_spoilage * 100}
					/>

					{isCurrentBalanceVisible && (
						<DetailsSingle
							label="Current Balance"
							value={formatQuantity(
								branchProduct.product.unit_of_measurement,
								branchProduct.current_balance,
							)}
						/>
					)}

					<Divider dashed>
						<Label label="MONEY" />
					</Divider>

					<DetailsSingle
						label="Price (Piece)"
						value={`₱${numberWithCommas(
							Number(branchProduct.price_per_piece).toFixed(2),
						)}`}
					/>
					<DetailsSingle
						label="Wholesale Price (piece)"
						value={`₱${numberWithCommas(
							Number(branchProduct.discounted_price_per_piece1).toFixed(2),
						)}`}
					/>
					<DetailsSingle
						label="Special Price (piece)"
						value={`₱${numberWithCommas(
							Number(branchProduct.discounted_price_per_piece2).toFixed(2),
						)}`}
					/>

					<DetailsSingle
						label="Price (Bulk)"
						value={`₱${numberWithCommas(
							Number(branchProduct.price_per_bulk).toFixed(2),
						)}`}
					/>
					<DetailsSingle
						label="Wholesale Price (bulk)"
						value={`₱${numberWithCommas(
							Number(branchProduct.discounted_price_per_bulk1).toFixed(2),
						)}`}
					/>
					<DetailsSingle
						label="Special Price (Bulk)"
						value={`₱${numberWithCommas(
							Number(branchProduct.discounted_price_per_bulk2).toFixed(2),
						)}`}
					/>
				</DetailsRow>
			)}
		</Modal>
	);
};
