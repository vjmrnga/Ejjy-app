import { message, Modal, Space } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { convertIntoArray } from 'utils';
import { RequestErrors } from '../../../../../components';
import { Label } from '../../../../../components/elements';
import { types } from '../../../../../ducks/requisition-slips';
import {
	request,
	requisitionSlipProductStatus,
} from '../../../../../global/types';
import { useRequisitionSlips } from '../../../../../hooks/useRequisitionSlips';
import '../../style.scss';
import { SetOutOfStockForm } from './SetOutOfStockForm';

interface Props {
	updateRequisitionSlipByFetching: any;
	requisitionSlip: any;
	visible: boolean;
	onClose: any;
}

export const SetOutOfStockModal = ({
	updateRequisitionSlipByFetching,
	requisitionSlip,
	visible,
	onClose,
}: Props) => {
	const {
		setOutOfStock,
		status: requisitionSlipsStatus,
		errors,
		recentRequest,
		reset,
	} = useRequisitionSlips();
	const [products, setProducts] = useState([]);

	// Effect: Format product
	useEffect(() => {
		if (visible && requisitionSlip) {
			const formattedProducts = requisitionSlip?.products
				?.filter(
					({ status, is_out_of_stock }) =>
						status === requisitionSlipProductStatus.NOT_ADDED_TO_OS &&
						!is_out_of_stock,
				)
				?.map((item) => {
					const { id, product } = item;

					return {
						requisition_slip_product_id: id,
						product_barcode: product.barcode,
						product_textcode: product.textcode,
						product_name: product.name,
					};
				});

			setProducts(formattedProducts);
		}
	}, [visible, requisitionSlipsStatus, recentRequest, requisitionSlip]);

	// Effect: Close modal if success
	useEffect(() => {
		if (
			requisitionSlipsStatus === request.SUCCESS &&
			recentRequest === types.SET_OUT_OF_STOCK
		) {
			updateRequisitionSlipByFetching();
			reset();
			onClose();
		}
	}, [requisitionSlipsStatus, recentRequest]);

	const isFetching = useCallback(
		() =>
			requisitionSlipsStatus === request.REQUESTING &&
			recentRequest === types.GET_REQUISITION_SLIP_BY_ID_AND_BRANCH,
		[requisitionSlipsStatus, recentRequest],
	);

	const isSettingOutOfStock = useCallback(
		() =>
			requisitionSlipsStatus === request.REQUESTING &&
			recentRequest === types.SET_OUT_OF_STOCK,
		[requisitionSlipsStatus, recentRequest],
	);

	const handleSubmit = (values) => {
		const requisition_slip_products = values.products
			.filter(({ selected }) => selected)
			.map(({ requisition_slip_product_id }) => ({
				requisition_slip_product_id,
				is_out_of_stock: true,
			}));

		if (products?.length > 0) {
			setOutOfStock({
				id: requisitionSlip.id,
				requisition_slip_products,
			});
		} else {
			message.error('Must have at least 1 product marked as out of stock.');
		}
	};

	return (
		<Modal
			className="SetOutOfStockModal Modal__large"
			footer={null}
			title="Out of Stock"
			visible={visible}
			centered
			closable
			onCancel={onClose}
		>
			<Space
				className="SetOutOfStockModal_space"
				direction="vertical"
				size={15}
			>
				<RequestErrors errors={convertIntoArray(errors)} />

				<Label label="Requested Products" />

				<SetOutOfStockForm
					loading={isFetching() || isSettingOutOfStock()}
					products={products}
					onClose={onClose}
					onSubmit={handleSubmit}
				/>
			</Space>
		</Modal>
	);
};
