/* eslint-disable react-hooks/exhaustive-deps */
import { Col, message, Modal, Row, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { FieldError, Label } from '../../../../../components/elements';
import { types } from '../../../../../ducks/requisition-slips';
import { request, requisitionSlipProductStatus } from '../../../../../global/types';
import { useRequisitionSlips } from '../../../../../hooks/useRequisitionSlips';
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
	const { setOutOfStock, status, errors, recentRequest, reset } = useRequisitionSlips();
	const [products, setProducts] = useState([]);

	// Effect: Format product
	useEffect(() => {
		if (visible && requisitionSlip) {
			const formattedProducts = requisitionSlip?.products
				?.filter(
					({ status, is_out_of_stock }) =>
						status === requisitionSlipProductStatus.NOT_ADDED_TO_OS && !is_out_of_stock,
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
	}, [visible, status, recentRequest, requisitionSlip]);

	// Effect: Close modal if success
	useEffect(() => {
		if (status === request.SUCCESS && recentRequest === types.SET_OUT_OF_STOCK) {
			updateRequisitionSlipByFetching();
			reset();
			onClose();
		}
	}, [status, recentRequest]);

	const isFetching = useCallback(
		() =>
			status === request.REQUESTING &&
			recentRequest === types.GET_REQUISITION_SLIP_BY_ID_AND_BRANCH,
		[status, recentRequest],
	);

	const isSettingOutOfStock = useCallback(
		() => status === request.REQUESTING && recentRequest === types.SET_OUT_OF_STOCK,
		[status, recentRequest],
	);

	const onSetOutOfStockSubmit = (values) => {
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
			title="Out of Stock"
			className="modal-large"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<Spin size="large" spinning={isFetching()}>
				{errors.map((error, index) => (
					<FieldError key={index} error={error} />
				))}

				<Row gutter={[15, 15]} align="middle">
					<Col span={12}>
						<Label label="Requested Products" />
					</Col>
				</Row>

				<SetOutOfStockForm
					products={products}
					onSubmit={onSetOutOfStockSubmit}
					onClose={onClose}
					loading={isSettingOutOfStock()}
				/>
			</Spin>
		</Modal>
	);
};
