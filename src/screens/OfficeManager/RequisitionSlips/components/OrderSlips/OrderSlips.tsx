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
import {
	convertIntoArray,
	convertToBulk,
	formatBalance,
} from '../../../../../utils/function';
import { useDeliveryReceipt } from '../../../hooks/useDeliveryReceipt';
import { useOrderSlips } from '../../../hooks/useOrderSlips';
import { useUsers } from '../../../../../hooks/useUsers';
import { CreateEditOrderSlipModal } from './CreateEditOrderSlipModal';
import { OrderSlipsTable } from './OrderSlipsTable';
import { SetOutOfStockModal } from './SetOutOfStockModal';
import { ViewOrderSlipModal } from './ViewOrderSlipModal';
import { MAX_PAGE_SIZE } from '../../../../../global/constants';

interface Props {
	requisitionSlip: any;
	fetchRequisitionSlip: any;
}

const pendingOrderSlipStatus = [orderSlipStatus.PREPARED];

export const OrderSlips = ({
	fetchRequisitionSlip,
	requisitionSlip,
}: Props) => {
	// State: Selection
	const [selectedBranchId, setSelectedBranchId] = useState(null);
	const [selectedOrderSlip, setSelectedOrderSlip] = useState(null);

	// State: Table Data
	const [requisitionSlipProducts, setRequisitionSlipProducts] = useState([]);

	// State: Modal
	const [viewOrderSlipVisible, setViewOrderSlipVisible] = useState(false);
	const [createEditOrderSlipVisible, setCreateEditOrderSlipVisible] =
		useState(false);
	const [createOutOfStockVisible, setCreateOutOfStockVisible] = useState(false);

	// CUSTOM HOOKS
	const { createDeliveryReceipt, status: deliveryReceiptStatus } =
		useDeliveryReceipt();
	const {
		orderSlips,
		getOrderSlipsExtended,
		status: orderSlipRequestStatus,
		recentRequest: orderSlipRecentRequest,
	} = useOrderSlips();
	const {
		branchProducts,
		getBranchProducts,
		status: branchProductsStatus,
		resetAll: branchProductsReset,
		warnings: branchProductsWarnings,
		errors: branchProducstErrors,
	} = useBranchProducts();
	const {
		users: branchPersonnels,
		getLocalUsers,
		status: usersStatus,
		warnings: userWarnings,
		errors: userErrors,
		reset: userReset,
	} = useUsers();

	const branches = useSelector(branchesSelectors.selectBranches());
	const setRequisitionSlipAction = useActionDispatch(
		prActions.setRequisitionSlipAction,
	);

	// METHODS
	// Effect: Fetch order slips
	useEffect(() => {
		if (requisitionSlip) {
			getOrderSlipsExtended(requisitionSlip.id);
		}
	}, [requisitionSlip]);

	// Effect: Format requested products in Create/Edit Order Slip form
	useEffect(() => {
		processOrderSlip(
			requisitionSlip,
			branchProducts,
			branchPersonnels,
			selectedOrderSlip,
		);
	}, [
		requisitionSlip,
		branchProducts,
		branchPersonnels,
		selectedBranchId,
		selectedOrderSlip,
	]);

	// Effect: Update requisition slip status if status is "New/Seen" after creating order slip
	useEffect(() => {
		if (
			orderSlipRequestStatus === request.SUCCESS &&
			orderSlipRecentRequest === orderSlipsTypes.CREATE_ORDER_SLIP
		) {
			const actionRequiresUpdate = [
				requisitionSlipActions.NEW,
				requisitionSlipActions.SEEN,
			];
			if (actionRequiresUpdate.includes(requisitionSlip?.action?.action)) {
				setRequisitionSlipAction({
					action: requisitionSlipActions.F_OS1_CREATED,
				});
			}
		}
	}, [orderSlipRequestStatus, orderSlipRecentRequest]);

	const getFirstBranchOptionId = useCallback(
		() =>
			branches.find(
				(branch) => branch.id !== requisitionSlip?.requesting_user?.branch?.id,
			)?.id,
		[branches, requisitionSlip],
	);

	const hasAvailableProducts = useCallback(
		() =>
			requisitionSlip?.products?.some(
				({ is_out_of_stock, status }) =>
					status === requisitionSlipProductStatus.NOT_ADDED_TO_OS &&
					!is_out_of_stock,
			),
		[requisitionSlip],
	);

	const processOrderSlip = (
		reqSlip,
		bProducts,
		bPersonnels,
		orderSlip = null,
	) => {
		let requestedProducts = [];

		if (orderSlip) {
			const findBranchProduct = (productId) =>
				bProducts.find((item) => item.product.id === productId);

			const findRequisitionSlipProduct = (productId) =>
				orderSlip.requisition_slip.products.find(
					({ product_id }) => product_id === productId,
				);

			requestedProducts = orderSlip.products.map((product) => {
				const { id: productId } = product.product;
				const branchProduct = findBranchProduct(productId);

				return processedOrderSlipProduct(
					product.id,
					product.product,
					{
						current: branchProduct?.current_balance,
						max_balance: branchProduct?.max_balance,
					},
					product.quantity_piece,
					findRequisitionSlipProduct(productId).quantity_piece,
					product.assigned_person?.id,
				);
			});
		} else {
			requestedProducts = reqSlip?.products
				?.filter(({ is_out_of_stock, status, product_id }) => {
					// Condition: Not yet added to OS
					// Condition: Not out of stock
					// Condition: Has branch products
					const branchProduct = bProducts.find(
						(item) => item.product.id === product_id,
					);

					return (
						status === requisitionSlipProductStatus.NOT_ADDED_TO_OS &&
						!is_out_of_stock &&
						!!branchProduct
					);
				})
				?.map((product) => {
					const branchProduct = bProducts.find(
						(item) => item.product.id === product.product_id,
					);

					return processedOrderSlipProduct(
						null,
						product.product,
						{
							current: branchProduct.current_balance,
							max_balance: branchProduct.max_balance,
						},
						'',
						product.quantity_piece,
						bPersonnels?.[0]?.id,
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
		const {
			id: productId,
			name,
			barcode,
			textcode,
			pieces_in_bulk,
			unit_of_measurement,
		} = product;
		const { current = '', max_balance = '' } = branchBalance;

		return {
			order_slip_product_id: orderSlipProductId,
			selected: true,
			product,
			product_id: productId,
			product_name: name,
			product_barcode: barcode,
			product_textcode: textcode,
			product_pieces_in_bulk: pieces_in_bulk,
			quantity: quantityPiece,
			ordered_quantity_piece: orderedQuantityPiece,
			ordered_quantity_bulk: convertToBulk(
				orderedQuantityPiece,
				pieces_in_bulk,
			),
			quantity_type: quantityTypes.PIECE,
			branch_current: formatBalance(unit_of_measurement, current),
			branch_max_balance: formatBalance(unit_of_measurement, max_balance),
			branch_current_bulk: formatBalance(
				unit_of_measurement,
				convertToBulk(current, pieces_in_bulk),
			),
			branch_max_balance_bulk: formatBalance(
				unit_of_measurement,
				convertToBulk(max_balance, pieces_in_bulk),
			),
			assigned_personnel: assignedPersonnel,
		};
	};

	const onChangePreparingBranch = (branchId) => {
		if (selectedBranchId !== branchId) {
			setSelectedBranchId(branchId);
			userReset();
			branchProductsReset();

			getLocalUsers(
				{
					page: 1,
					pageSize: MAX_PAGE_SIZE,
					branchId,
					userType: userTypes.BRANCH_PERSONNEL,
				},
				true,
			);

			const productIds = requisitionSlip.products
				.map(({ product_id }) => product_id)
				.join(',');

			getBranchProducts({ productIds, branchId, page: 1 }, true);
		}
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
		() =>
			orderSlips.filter(({ status }) =>
				pendingOrderSlipStatus.includes(status?.value),
			).length,
		[orderSlips],
	);

	return (
		<Box>
			<TableHeaderOrderSlip
				title="F-OS1"
				buttonName="Create Order Slip"
				onCreate={onCreateOrderSlip}
				onCreateDisabled={
					![
						requisitionSlipActions.SEEN,
						requisitionSlipActions.F_OS1_CREATING,
					].includes(requisitionSlip?.action?.action) || !hasAvailableProducts()
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
				loading={[deliveryReceiptStatus, orderSlipRequestStatus].includes(
					request.REQUESTING,
				)}
			/>

			{viewOrderSlipVisible && (
				<ViewOrderSlipModal
					orderSlip={selectedOrderSlip}
					onClose={() => setViewOrderSlipVisible(false)}
				/>
			)}

			<CreateEditOrderSlipModal
				updateRequisitionSlipByFetching={fetchRequisitionSlip}
				requisitionSlip={requisitionSlip}
				orderSlip={selectedOrderSlip}
				selectedBranchId={selectedBranchId}
				branchPersonnels={branchPersonnels}
				requestedProducts={requisitionSlipProducts}
				onChangePreparingBranch={onChangePreparingBranch}
				visible={createEditOrderSlipVisible}
				onClose={() => setCreateEditOrderSlipVisible(false)}
				warnings={[
					...convertIntoArray(branchProductsWarnings, 'Branch Products'),
					...convertIntoArray(userWarnings, 'Users'),
				]}
				errors={[
					...convertIntoArray(branchProducstErrors, 'Branch Products'),
					...convertIntoArray(userErrors, 'Users'),
				]}
				loading={[usersStatus, branchProductsStatus].includes(
					request.REQUESTING,
				)}
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
