import { Divider, Modal } from 'antd';
import { SHOW_HIDE_SHORTCUT } from 'global/constants';
import React, { useEffect, useState } from 'react';
import { DetailsRow, DetailsSingle } from '../../../../../components';
import { Button, Label } from '../../../../../components/elements';
import { unitOfMeasurementTypes } from '../../../../../global/types';
import {
	confirmPassword,
	getKeyDownCombination,
	numberWithCommas,
} from '../../../../../utils/function';

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
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);

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
			className="ViewBranchProductModal modal-large"
			title={`[VIEW] Product Details (${branchName})`}
			visible={visible}
			footer={[<Button text="Close" onClick={handleClose} />]}
			onCancel={handleClose}
			centered
			closable
		>
			<DetailsRow>
				<DetailsSingle
					label="Barcode"
					value={
						branchProduct?.product?.barcode || branchProduct?.product?.textcode
					}
				/>
				<DetailsSingle label="Name" value={branchProduct?.product?.name} />

				<DetailsSingle
					label="Checking"
					value={branchProduct?.is_daily_checked ? 'Daily' : 'Random'}
				/>

				<DetailsSingle
					label="Include In Scale"
					value={branchProduct?.is_shown_In_scale_list ? 'Yes' : 'No'}
				/>

				<DetailsSingle
					label="In Stock"
					value={branchProduct?.is_sold_in_branch ? 'Yes' : 'No'}
				/>

				<Divider dashed>
					<Label label="Quantity" />
				</Divider>

				<DetailsSingle
					label="Reorder Point"
					value={branchProduct?.reorder_point}
				/>
				<DetailsSingle label="Max Balance" value={branchProduct?.max_balance} />

				<DetailsSingle
					label="Allowable Spoilage (%)"
					value={branchProduct?.allowable_spoilage * 100}
				/>

				{isCurrentBalanceVisible && (
					<DetailsSingle
						label="Current Balance"
						value={
							branchProduct?.product?.unit_of_measurement ===
							unitOfMeasurementTypes.WEIGHING
								? Number(branchProduct?.current_balance).toFixed(3)
								: branchProduct?.current_balance
						}
					/>
				)}

				<Divider dashed>
					<Label label="MONEY" />
				</Divider>

				<DetailsSingle
					label="Price (Piece)"
					value={`₱${numberWithCommas(
						Number(branchProduct?.price_per_piece).toFixed(2),
					)}`}
				/>
				<DetailsSingle
					label="Discounted Price 1 (Piece)"
					value={`₱${numberWithCommas(
						Number(branchProduct?.discounted_price_per_piece1).toFixed(2),
					)}`}
				/>
				<DetailsSingle
					label="Discounted Price 2 (Piece)"
					value={`₱${numberWithCommas(
						Number(branchProduct?.discounted_price_per_piece2).toFixed(2),
					)}`}
				/>

				<DetailsSingle
					label="Price (Bulk)"
					value={`₱${numberWithCommas(
						Number(branchProduct?.price_per_bulk).toFixed(2),
					)}`}
				/>
				<DetailsSingle
					label="Discounted Price 1 (Bulk)"
					value={`₱${numberWithCommas(
						Number(branchProduct?.discounted_price_per_bulk1).toFixed(2),
					)}`}
				/>
				<DetailsSingle
					label="Discounted Price 2 (Bulk)"
					value={`₱${numberWithCommas(
						Number(branchProduct?.discounted_price_per_bulk2).toFixed(2),
					)}`}
				/>
			</DetailsRow>
		</Modal>
	);
};
