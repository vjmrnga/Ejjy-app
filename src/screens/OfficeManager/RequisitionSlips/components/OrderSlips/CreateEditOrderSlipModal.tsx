import { Col, Divider, message, Modal, Row } from 'antd';
import { RequestErrors, RequestWarnings } from 'components';
import { Label, Select } from 'components/elements';
import { selectors as authSelectors } from 'ducks/auth';
import { selectors as branchesSelectors } from 'ducks/OfficeManager/branches';
import { types } from 'ducks/order-slips';
import {
	IS_APP_LIVE,
	quantityTypes,
	request,
	requisitionSlipDetailsType,
} from 'global';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { convertIntoArray, convertToPieces } from 'utils';
import { useOrderSlips } from '../../../hooks/useOrderSlips';
import { RequisitionSlipDetails } from '../RequisitionSlipDetails';
import { CreateEditOrderSlipForm } from './CreateEditOrderSlipForm';
import { OrderSlipDetails } from './OrderSlipDetails';

interface Props {
	updateRequisitionSlipByFetching: any;
	requisitionSlip: any;
	orderSlip: any;
	selectedBranchId?: number;
	requestedProducts: any;
	branchPersonnels: any;

	onChangePreparingBranch: any;
	visible: boolean;
	onClose: any;
	loading: any;

	warnings: any;
	errors: any;
}

export const CreateEditOrderSlipModal = ({
	updateRequisitionSlipByFetching,
	requisitionSlip,
	orderSlip,

	selectedBranchId,
	requestedProducts,
	branchPersonnels,
	onChangePreparingBranch,

	visible,
	onClose,
	loading,
	warnings,
	errors,
}: Props) => {
	// CUSTOM HOOKS
	const {
		createOrderSlip,
		editOrderSlip,
		status: orderSlipsStatus,
		errors: orderSlipsErrors,
		recentRequest,
		reset,
	} = useOrderSlips();

	// SELECTORS
	const user = useSelector(authSelectors.selectUser());
	const branches = useSelector(branchesSelectors.selectBranches());

	// Effect: Close modal if create/edit success
	useEffect(() => {
		const recentRequests = [types.CREATE_ORDER_SLIP, types.EDIT_ORDER_SLIP];

		if (
			orderSlipsStatus === request.SUCCESS &&
			recentRequests.includes(recentRequest)
		) {
			updateRequisitionSlipByFetching();
			reset();
			onClose();
		}
	}, [orderSlipsStatus, recentRequest]);

	const getBranchOptions = useCallback(
		() =>
			branches
				.filter(
					({ id, online_url }) =>
						id !== requisitionSlip?.requesting_user?.branch?.id && online_url,
				)
				.map((branch) => ({
					value: branch?.id,
					name: branch?.name,
				})),
		[branches, requisitionSlip],
	);

	const getAssignedPersonnelOptions = useCallback(
		() =>
			branchPersonnels?.map((personnel) => ({
				value: personnel.id,
				name: `${personnel.first_name} ${personnel.last_name}`,
			})) || [],
		[branchPersonnels],
	);

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
			is_online: IS_APP_LIVE,
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
				is_online: IS_APP_LIVE,
			};

			editOrderSlip(data);
		} else {
			message.error('Must have at least 1 product in order slip.');
		}
	};

	return (
		<Modal
			className="Modal__large ModalLarge__scrollable"
			footer={null}
			title={`${orderSlip ? '[Edit]' : '[Create]'} F-OS1`}
			visible={visible}
			centered
			closable
			onCancel={onClose}
		>
			<RequestErrors
				errors={[
					...errors,
					...convertIntoArray(orderSlipsErrors, 'Order Slips'),
				]}
				withSpaceBottom
			/>

			<RequestWarnings warnings={warnings} withSpaceBottom />

			{orderSlip ? (
				<OrderSlipDetails orderSlip={orderSlip} />
			) : (
				<RequisitionSlipDetails
					requisitionSlip={requisitionSlip}
					type={requisitionSlipDetailsType.CREATE_EDIT}
				/>
			)}

			<Divider dashed />

			<Row align="middle" gutter={[16, 16]}>
				<Col span={12}>
					<Label label="Requested Products" spacing />
				</Col>
				<Col span={12}>
					<Select
						options={getBranchOptions()}
						placeholder="Select Branch"
						value={selectedBranchId}
						onChange={onChangePreparingBranch}
					/>
				</Col>
			</Row>

			<CreateEditOrderSlipForm
				assignedPersonnelOptions={getAssignedPersonnelOptions()}
				loading={orderSlipsStatus === request.REQUESTING || loading}
				orderSlip={orderSlip}
				requestedProducts={requestedProducts}
				onClose={onClose}
				onSubmit={orderSlip ? onEditOrderSlipSubmit : onCreateOrderSlipSubmit}
			/>
		</Modal>
	);
};
