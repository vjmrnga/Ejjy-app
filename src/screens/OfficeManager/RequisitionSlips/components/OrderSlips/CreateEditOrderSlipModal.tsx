/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Divider, message, Modal, Row } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FieldError, Label, Select } from '../../../../../components/elements';
import { selectors as authSelectors } from '../../../../../ducks/auth';
import { selectors as branchesSelectors } from '../../../../../ducks/OfficeManager/branches';
import { types } from '../../../../../ducks/order-slips';
import { quantityTypes, request } from '../../../../../global/types';
import { convertToPieces } from '../../../../../utils/function';
import { useOrderSlips } from '../../../hooks/useOrderSlips';
import { RequisitionSlipDetails, requisitionSlipDetailsType } from '../RequisitionSlipDetails';
import { CreateEditOrderSlipForm } from './CreateEditOrderSlipForm';
import { OrderSlipDetails } from './OrderSlipDetails';

interface Props {
	updateRequisitionSlipByFetching: any;
	requisitionSlip: any;
	orderSlip: any;
	selectedBranchId?: number;
	requestedProducts: any;
	onChangePreparingBranch: any;
	visible: boolean;
	onClose: any;
	loading: any;
	branchPersonnels: any;
}

export const CreateEditOrderSlipModal = ({
	branchPersonnels,

	updateRequisitionSlipByFetching,
	requisitionSlip,
	orderSlip,
	selectedBranchId,
	requestedProducts,
	onChangePreparingBranch,
	visible,
	onClose,
	loading,
}: Props) => {
	const user = useSelector(authSelectors.selectUser());
	const branches = useSelector(branchesSelectors.selectBranches());
	const { createOrderSlip, editOrderSlip, status, errors, recentRequest, reset } = useOrderSlips();

	// Effect: Close modal if create/edit success
	useEffect(() => {
		const recentRequests = [types.CREATE_ORDER_SLIP, types.EDIT_ORDER_SLIP];

		if (status === request.SUCCESS && recentRequests.includes(recentRequest)) {
			updateRequisitionSlipByFetching();
			reset();
			onClose();
		}
	}, [status, recentRequest]);

	const getBranchOptions = useCallback(
		() =>
			branches
				.filter(
					({ id, online_url }) => id !== requisitionSlip?.requesting_user?.branch?.id && online_url,
				)
				.map((branch) => ({
					value: branch?.id,
					name: branch?.name,
				})),
		[branches, requisitionSlip],
	);

	const getAssignedPersonnelOptions = useCallback(() => {
		return (
			branchPersonnels?.map((personnel) => ({
				value: personnel.id,
				name: `${personnel.first_name} ${personnel.last_name}`,
			})) || []
		);
	}, [branchPersonnels]);

	const onCreateOrderSlipSubmit = (values) => {
		const products = values.requestedProducts
			.filter(({ selected }) => selected)
			.map((product) => ({
				product_id: product.product_id,
				quantity_piece:
					product.quantity_type === quantityTypes.PIECE
						? product.quantity
						: convertToPieces(product.quantity, product.pieces_in_bulk),
				assigned_person_id: product.assigned_personnel,
			}));

		const data = {
			requesting_user_id: user.id,
			assigned_store_id: selectedBranchId,
			requisition_slip_id: requisitionSlip.id,
			products,
		};

		createOrderSlip(data);
	};

	const onEditOrderSlipSubmit = (values) => {
		const products = values.requestedProducts
			.filter(({ selected }) => selected)
			.map((product) => ({
				order_slip_product_id: product.order_slip_product_id,
				product_id: product.product_id,
				quantity_piece:
					product.quantity_type === quantityTypes.PIECE
						? product.quantity
						: convertToPieces(product.quantity, product.pieces_in_bulk),
				assigned_person_id: product.assigned_personnel,
			}));

		if (products?.length > 0) {
			const data = {
				id: orderSlip.id,
				assigned_store_id: selectedBranchId,
				products,
			};

			editOrderSlip(data);
		} else {
			message.error('Must have at least 1 product in order slip.');
		}
	};

	return (
		<Modal
			title={`${orderSlip ? '[EDIT]' : '[CREATE]'} F-OS1`}
			className="modal-large"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}

			{orderSlip ? (
				<OrderSlipDetails orderSlip={orderSlip} />
			) : (
				<RequisitionSlipDetails
					requisitionSlip={requisitionSlip}
					type={requisitionSlipDetailsType.CREATE_EDIT}
				/>
			)}

			<Divider dashed />

			<Row gutter={[15, 15]} align="middle">
				<Col span={12}>
					<Label label="Requested Products" />
				</Col>
				<Col span={12}>
					<Select
						placeholder="Select Branch"
						options={getBranchOptions()}
						onChange={onChangePreparingBranch}
						value={selectedBranchId}
					/>
				</Col>
			</Row>

			<CreateEditOrderSlipForm
				orderSlip={orderSlip}
				requestedProducts={requestedProducts}
				assignedPersonnelOptions={getAssignedPersonnelOptions()}
				onSubmit={orderSlip ? onEditOrderSlipSubmit : onCreateOrderSlipSubmit}
				onClose={onClose}
				loading={status === request.REQUESTING || loading}
			/>
		</Modal>
	);
};

CreateEditOrderSlipModal.defaultProps = {
	loading: false,
};
