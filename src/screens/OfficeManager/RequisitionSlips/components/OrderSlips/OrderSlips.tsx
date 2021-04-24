/* eslint-disable react-hooks/exhaustive-deps */
// TODO:: Enable /disable the create buttons (out of stock and order slip)
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TableHeaderOrderSlip } from '../../../../../components';
import { Box } from '../../../../../components/elements';
import { selectors as branchesSelectors } from '../../../../../ducks/OfficeManager/branches';
import { types as orderSlipsTypes } from '../../../../../ducks/order-slips';
import { actions as prActions } from '../../../../../ducks/requisition-slips';
import {
	orderSlipStatus,
	quantityTypes,
	request,
	requisitionSlipActions,
	requisitionSlipProductStatus,
	userTypes,
} from '../../../../../global/types';
import { useActionDispatch } from '../../../../../hooks/useActionDispatch';
import { useBranchProducts } from '../../../../../hooks/useBranchProducts';
import { convertToBulk } from '../../../../../utils/function';
import { useDeliveryReceipt } from '../../../hooks/useDeliveryReceipt';
import { useOrderSlips } from '../../../hooks/useOrderSlips';
import { useUsers } from '../../../hooks/useUsers';
import { CreateEditOrderSlipModal } from './CreateEditOrderSlipModal';
import { OrderSlipsTable } from './OrderSlipsTable';
import { SetOutOfStockModal } from './SetOutOfStockModal';
import { ViewOrderSlipModal } from './ViewOrderSlipModal';

interface Props {
	requisitionSlip: any;
	fetchRequisitionSlip: any;
}

const pendingOrderSlipStatus = [orderSlipStatus.PREPARED];

export const OrderSlips = ({ fetchRequisitionSlip, requisitionSlip }: Props) => {
	// State: Selection
	const [selectedBranchId, setSelectedBranchId] = useState(null);
	const [selectedOrderSlip, setSelectedOrderSlip] = useState(null);

	// State: Table Data
	const [requisitionSlipProducts, setRequisitionSlipProducts] = useState([]);

	// State: Modal
	const [viewOrderSlipVisible, setViewOrderSlipVisible] = useState(false);
	const [createEditOrderSlipVisible, setCreateEditOrderSlipVisible] = useState(false);
	const [createOutOfStockVisible, setCreateOutOfStockVisible] = useState(false);

	// CUSTOM HOOKS
	const { createDeliveryReceipt, status: deliveryReceiptStatus } = useDeliveryReceipt();
	const {
		orderSlips,
		getOrderSlipsExtended,
		status: orderSlipStatus,
		recentRequest: orderSlipRecentRequest,
	} = useOrderSlips();
	const {
		branchProducts,
		getBranchProducts,
		status: branchProductsStatus,
		errors: branchProductsErrors,
		warnings: branchProductsWarnings,
	} = useBranchProducts({ pageSize: 500 });
	const {
		users,
		getOnlineUsers,
		status: usersStatus,
		errors: usersErrors,
		warnings: usersWarnings,
	} = useUsers();

	const branches = useSelector(branchesSelectors.selectBranches());
	const setRequisitionSlipAction = useActionDispatch(prActions.setRequisitionSlipAction);

	// METHODS
	// Effect: Fetch order slips
	useEffect(() => {
		if (requisitionSlip) {
			getOrderSlipsExtended(requisitionSlip.id);
		}
	}, [requisitionSlip]);

	// Effect: Format requested products in Create/Edit Order Slip form
	useEffect(() => {
		processOrderSlip(requisitionSlip, branchProducts, users, selectedOrderSlip);
	}, [requisitionSlip, branchProducts, users, selectedBranchId, selectedOrderSlip]);

	// Effect: Update requisition slip status if status is "New/Seen" after creating order slip
	useEffect(() => {
		if (
			orderSlipStatus === request.SUCCESS &&
			orderSlipRecentRequest === orderSlipsTypes.CREATE_ORDER_SLIP
		) {
			const actionRequiresUpdate = [requisitionSlipActions.NEW, requisitionSlipActions.SEEN];
			if (actionRequiresUpdate.includes(requisitionSlip?.action?.action)) {
				setRequisitionSlipAction({ action: requisitionSlipActions.F_OS1_CREATED });
			}
		}
	}, [orderSlipStatus, orderSlipRecentRequest]);

	const getFirstBranchOptionId = useCallback(
		() => branches.find((branch) => branch.id !== requisitionSlip?.requesting_user?.branch?.id)?.id,
		[branches, requisitionSlip],
	);

	const hasAvailableProducts = useCallback(
		() =>
			!!requisitionSlip?.products?.filter(
				({ is_out_of_stock, status }) =>
					status === requisitionSlipProductStatus.NOT_ADDED_TO_OS && !is_out_of_stock,
			).length,
		[requisitionSlip],
	);

	const processOrderSlip = (
		requisitionSlip,
		branchProducts,
		branchPersonnels,
		orderSlip = null,
	) => {
		let requestedProducts = [];

		if (selectedOrderSlip) {
			const findBranchProduct = (productId) =>
				branchProducts.find((item) => item.product.id === productId);

			const findRequisitionSlipProduct = (productId) =>
				orderSlip.requisition_slip.products.find(({ product_id }) => product_id === productId);

			requestedProducts = orderSlip.products.map((product) => {
				const { id: productId } = product.product;
				const branchProduct = findBranchProduct(productId);

				return processedOrderSlipProduct(
					product.id,
					product.product,
					{ current: branchProduct?.current_balance, max_balance: branchProduct?.max_balance },
					product.quantity_piece,
					findRequisitionSlipProduct(productId).quantity_piece,
					product.assigned_person?.id,
				);
			});
		} else {
			requestedProducts = requisitionSlip?.products
				?.filter(({ is_out_of_stock, status, product_id }) => {
					// Condition: Not yet added to OS
					// Condition: Not out of stock
					// Condition: Has branch products
					const branchProduct = branchProducts.find((item) => item.product.id === product_id);

					return (
						status === requisitionSlipProductStatus.NOT_ADDED_TO_OS &&
						!is_out_of_stock &&
						!!branchProduct
					);
				})
				?.map((product) => {
					const branchProduct = branchProducts.find(
						(item) => item.product.id === product.product_id,
					);
					console.log('product', product);
					return processedOrderSlipProduct(
						null,
						product.product,
						{ current: branchProduct.current_balance, max_balance: branchProduct.max_balance },
						'',
						product.quantity_piece,
						branchPersonnels?.[0]?.id,
					);
				});
		}

		setRequisitionSlipProducts(requestedProducts);
	};

	const processedOrderSlipProduct = (
		orderSlipProductId,
		product,
		branchBalance,
		quantityPiece,
		orderedQuantityPiece,
		assignedPersonnel,
	) => {
		const { id: productId, name, barcode, textcode, pieces_in_bulk } = product;
		const { current = '', max_balance = '' } = branchBalance;

		return {
			order_slip_product_id: orderSlipProductId,
			selected: true,
			product_id: productId,
			product_name: name,
			product_barcode: barcode,
			product_textcode: textcode,
			product_pieces_in_bulk: pieces_in_bulk,
			quantity: quantityPiece,
			ordered_quantity_piece: orderedQuantityPiece,
			ordered_quantity_bulk: convertToBulk(orderedQuantityPiece, pieces_in_bulk),
			quantity_type: quantityTypes.PIECE,
			branch_current: current,
			branch_max_balance: max_balance,
			branch_current_bulk: convertToBulk(current, pieces_in_bulk),
			branch_max_balance_bulk: convertToBulk(max_balance, pieces_in_bulk),
			assigned_personnel: assignedPersonnel,
		};
	};

	const onChangePreparingBranch = (branchId) => {
		setSelectedBranchId(branchId);

		const productIds = requisitionSlipProducts.map((product) => product.product_id);
		getOnlineUsers({ branchId, userType: userTypes.BRANCH_PERSONNEL });
		getBranchProducts({ productIds: productIds, branchId, page: 1 });
	};

	const onCreateOrderSlip = () => {
		setSelectedOrderSlip(null);
		onChangePreparingBranch(getFirstBranchOptionId());
		setCreateEditOrderSlipVisible(true);
	};

	const onCreateOutOfStock = () => {
		setSelectedOrderSlip(null);
		setCreateOutOfStockVisible(true);
	};

	const onViewOrderSlip = (orderSlip) => {
		setSelectedOrderSlip(orderSlip);
		setViewOrderSlipVisible(true);
	};

	const onEditOrderSlip = (orderSlip) => {
		onChangePreparingBranch(orderSlip?.assigned_store?.id);
		setSelectedOrderSlip(orderSlip);
		setCreateEditOrderSlipVisible(true);
	};

	const onCreateDeliveryReceipt = (id) => {
		createDeliveryReceipt(id);
	};

	const getPendingCount = useCallback(
		() => orderSlips.filter(({ status }) => pendingOrderSlipStatus.includes(status?.value)).length,
		[orderSlips],
	);

	return (
		<Box>
			<TableHeaderOrderSlip
				title="F-OS1"
				buttonName="Create Order Slip"
				onCreate={onCreateOrderSlip}
				onCreateDisabled={
					![requisitionSlipActions.SEEN, requisitionSlipActions.F_OS1_CREATING].includes(
						requisitionSlip?.action?.action,
					) || !hasAvailableProducts()
				}
				onOutOfStock={onCreateOutOfStock}
				onOutOfStockDisabled={!hasAvailableProducts()}
				pending={getPendingCount()}
			/>

			<OrderSlipsTable
				orderSlips={orderSlips}
				onViewOrderSlip={onViewOrderSlip}
				onEditOrderSlip={onEditOrderSlip}
				onCreateDeliveryReceipt={onCreateDeliveryReceipt}
				loading={[deliveryReceiptStatus, orderSlipStatus].includes(request.REQUESTING)}
			/>

			<ViewOrderSlipModal
				visible={viewOrderSlipVisible}
				orderSlip={selectedOrderSlip}
				onClose={() => setViewOrderSlipVisible(false)}
			/>

			<CreateEditOrderSlipModal
				updateRequisitionSlipByFetching={fetchRequisitionSlip}
				requisitionSlip={requisitionSlip}
				orderSlip={selectedOrderSlip}
				selectedBranchId={selectedBranchId}
				branchPersonnels={users}
				requestedProducts={requisitionSlipProducts}
				onChangePreparingBranch={onChangePreparingBranch}
				visible={createEditOrderSlipVisible}
				onClose={() => setCreateEditOrderSlipVisible(false)}
				loading={[usersStatus, branchProductsStatus].includes(request.REQUESTING)}
			/>

			<SetOutOfStockModal
				updateRequisitionSlipByFetching={fetchRequisitionSlip}
				requisitionSlip={requisitionSlip}
				visible={createOutOfStockVisible}
				onClose={() => setCreateOutOfStockVisible(false)}
			/>
		</Box>
	);
};
