/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Breadcrumb, Container, QuantitySelect } from '../../../components';
import { selectors as authSelectors } from '../../../ducks/auth';
import { types as orderSlipsTypes } from '../../../ducks/OfficeManager/order-slips';
import { selectors, types } from '../../../ducks/purchase-requests';
import { EMPTY_DR_STATUS } from '../../../global/constants';
import {
	orderSlipStatus as osStatus,
	purchaseRequestProductStatus,
	quantityTypes,
	request,
} from '../../../global/types';
import { usePurchaseRequests } from '../../../hooks/usePurchaseRequests';
import {
	convertToBulk,
	convertToPieces,
	formatDateTime,
	getOrderSlipStatus,
	sleep,
} from '../../../utils/function';
import { useBranches } from '../hooks/useBranches';
import { useOrderSlips } from '../hooks/useOrderSlips';
import { OrderSlipActions } from './components/OrderSlipActions';
import { OrderSlipList } from './components/OrderSlipList';
import { RequestedProducts } from './components/RequestedProducts';
import './style.scss';

interface Props {
	match: any;
}

const ViewPurchaseRequest = ({ match }: Props) => {
	// Routing
	const purchaseRequestId = match?.params?.id;
	const history = useHistory();

	// Custom hooks
	const user = useSelector(authSelectors.selectUser());
	const { branches } = useBranches();
	const {
		getPurchaseRequestsById,
		getPurchaseRequestsByIdAndBranch,
		editPurchaseRequest,
		removePurchaseRequestByBranch,
		status: purchaseRequestStatus,
		recentRequest: purchaseRequestRecentRequest,
	} = usePurchaseRequests();
	const {
		orderSlips,
		getOrderSlipsExtended,
		createOrderSlip,
		editOrderSlip,
		status: orderSlipStatus,
		recentRequest: orderSlipRecentRequest,
	} = useOrderSlips();
	const purchaseRequest = useSelector(selectors.selectPurchaseRequest());
	const purchaseRequestsByBranch = useSelector(selectors.selectPurchaseRequestsByBranch());

	// States
	const [selectedBranchId, setSelectedBranchId] = useState(null);
	const [selectedOrderSlip, setSelectedOrderSlip] = useState(null);
	const [requestedProductsData, setRequestProductsData] = useState([]);
	const [orderSlipsData, setOrderSlipsData] = useState([]);
	const [purchaseRequestProducts, setPurchaseRequestProducts] = useState([]);
	const [createEditOrderSlipVisible, setCreateEditOrderSlipVisible] = useState(false);
	const [viewOrderSlipVisible, setViewOrderSlipVisible] = useState(false);
	const [assignedPersonnelOptions, setAssignedPersonnelOptions] = useState([]);

	useEffect(() => {
		const defaultBranchId = branches?.[0]?.id;
		if (defaultBranchId) {
			setSelectedBranchId(defaultBranchId);
			getPurchaseRequestsByIdAndBranch(purchaseRequestId, defaultBranchId);
		}

		getPurchaseRequestsById(purchaseRequestId);
		getOrderSlipsExtended(purchaseRequestId);
		removePurchaseRequestByBranch();
	}, []);

	// Effect: Fetch data
	useEffect(() => {
		if (
			!purchaseRequest &&
			purchaseRequestRecentRequest === types.GET_PURCHASE_REQUEST_BY_ID &&
			purchaseRequestStatus === request.ERROR
		) {
			history.replace('/404');
		}
	}, [purchaseRequest, purchaseRequestStatus, purchaseRequestRecentRequest]);

	// Effect: Format requested products to be rendered in Table
	useEffect(() => {
		if (purchaseRequest && purchaseRequestStatus === request.SUCCESS) {
			const formattedRequestedProducts = purchaseRequest?.products.map((requestedProduct) => {
				const { product, quantity_piece } = requestedProduct;
				const { barcode, name, pieces_in_bulk } = product;

				return {
					_quantity_bulk: convertToBulk(quantity_piece, pieces_in_bulk),
					_quantity_piece: quantity_piece,
					barcode,
					name,
					quantity: quantity_piece,
				};
			});

			sleep(500).then(() => setRequestProductsData(formattedRequestedProducts));
		}
	}, [purchaseRequest, purchaseRequestStatus]);

	// Effect: Format requested products in Create Order Slip form
	useEffect(() => {
		if (
			selectedBranchId &&
			purchaseRequestStatus === request.SUCCESS &&
			purchaseRequestRecentRequest === types.GET_PURCHASE_REQUEST_BY_ID_AND_BRANCH
		) {
			processOrderSlip(selectedOrderSlip);
		}
	}, [
		selectedBranchId,
		selectedOrderSlip,
		purchaseRequestsByBranch,
		purchaseRequestStatus,
		purchaseRequestRecentRequest,
	]);

	// Effect: Format order slips to be rendered in Table
	useEffect(() => {
		if (orderSlipStatus === request.SUCCESS) {
			const formattedOrderSlips = orderSlips.map((orderSlip) => {
				const { id, datetime_created, status } = orderSlip;
				const { value, percentage_fulfilled } = status;

				const onView = value === osStatus.DELIVERED ? () => onViewOrderSlip(orderSlip) : null;
				const onEdit = value === osStatus.PREPARING ? () => onEditOrderSlip(orderSlip) : null;
				const onCreateDR = null;

				return {
					id,
					datetime_created: formatDateTime(datetime_created),
					status: getOrderSlipStatus(value, percentage_fulfilled * 100),
					dr_status: EMPTY_DR_STATUS,
					actions: <OrderSlipActions onView={onView} onEdit={onEdit} onCreateDR={onCreateDR} />,
				};
			});
			sleep(500).then(() => setOrderSlipsData(formattedOrderSlips));
		}
	}, [orderSlipStatus]);

	// Effect: Close modal if create/edit success
	useEffect(() => {
		const recentRequests = [orderSlipsTypes.CREATE_ORDER_SLIP, orderSlipsTypes.EDIT_ORDER_SLIP];
		if (orderSlipStatus === request.SUCCESS && recentRequests.includes(orderSlipRecentRequest)) {
			setCreateEditOrderSlipVisible(false);
			setSelectedOrderSlip(null);
		}
	}, [orderSlipStatus, orderSlipRecentRequest]);

	const processOrderSlip = (orderSlip = null) => {
		const branchData = purchaseRequestsByBranch?.[selectedBranchId];

		if (branchData) {
			let requestedProducts = [];

			const personnelOptions = branchData.branch_personnels.map((personnel) => ({
				value: personnel.id,
				name: `${personnel.first_name} ${personnel.last_name}`,
			}));
			setAssignedPersonnelOptions(personnelOptions);

			if (orderSlip) {
				const findBranchBalance = (productId) =>
					branchData.products.find(({ product }) => product?.product_id === productId)
						?.branch_balance;

				const findPurchaseRequestProduct = (productId) =>
					orderSlip.purchase_request.products.find(({ product_id }) => product_id === productId);

				requestedProducts = orderSlip.products.map((product) => {
					const {
						id: orderSlipProductId,
						quantity_piece: orderedQuantityPiece,
						assigned_person,
					} = product;
					const { id: productId, name, barcode, pieces_in_bulk } = product.product;
					const { current = '', max_balance = '' } = findBranchBalance(productId);
					const { quantity_piece = '' } = findPurchaseRequestProduct(productId);

					return {
						order_slip_product_id: orderSlipProductId,
						selected: true,
						product_id: productId,
						product_name: name,
						product_barcode: barcode,
						product_pieces_in_bulk: pieces_in_bulk,
						quantity: quantity_piece,
						ordered_quantity_piece: orderedQuantityPiece,
						ordered_quantity_bulk: convertToBulk(orderedQuantityPiece, pieces_in_bulk),
						quantity_type: orderedQuantityPiece ? quantityTypes.PIECE : quantityTypes.BULK,
						branch_current: current,
						branch_max_balance: max_balance,
						branch_current_bulk: convertToBulk(current, pieces_in_bulk),
						branch_max_balance_bulk: convertToBulk(max_balance, pieces_in_bulk),
						assigned_personnel: assigned_person?.id,
					};
				});

				setPurchaseRequestProducts(requestedProducts);
			} else {
				requestedProducts = branchData.products
					.filter(({ status }) => status === purchaseRequestProductStatus.NOT_ADDED_TO_OS)
					.map((product) => {
						const { id: productId, name, barcode, pieces_in_bulk } = product.product.product;
						const { quantity_piece: orderedQuantityPiece } = product.product;
						const { current, max_balance } = product.branch_balance;

						return {
							selected: true,
							product_id: productId,
							product_name: name,
							product_barcode: barcode,
							product_pieces_in_bulk: pieces_in_bulk,
							quantity: '',
							ordered_quantity_piece: orderedQuantityPiece,
							ordered_quantity_bulk: convertToBulk(orderedQuantityPiece, pieces_in_bulk),
							quantity_type: quantityTypes.PIECE,
							branch_current: current,
							branch_max_balance: max_balance,
							branch_current_bulk: convertToBulk(current, pieces_in_bulk),
							branch_max_balance_bulk: convertToBulk(max_balance, pieces_in_bulk),
							assigned_personnel: branchData?.branch_personnels?.[0]?.id,
						};
					});
			}

			setPurchaseRequestProducts(requestedProducts);
		}
	};

	const getBreadcrumbItems = useCallback(
		() => [
			{ name: 'Purchase Requests', link: '/purchase-requests' },
			{ name: `#${purchaseRequest?.id}` },
		],
		[purchaseRequest],
	);

	const getRequestor = useCallback(() => {
		const { first_name = '', last_name = '', branch = {} } = purchaseRequest?.requesting_user || {};
		return `${first_name} ${last_name} - ${branch?.name || ''}`;
	}, [purchaseRequest]);

	const onQuantityTypeChange = (quantityType) => {
		const requestProducts = requestedProductsData.map((requestProduct) => ({
			...requestProduct,
			quantity:
				quantityType === quantityTypes.PIECE
					? requestProduct._quantity_piece
					: requestProduct._quantity_bulk,
		}));
		setRequestProductsData(requestProducts);
	};

	const getRequestProductsColums = useCallback(
		() => [
			{ title: 'Barcode', dataIndex: 'barcode' },
			{ title: 'Name', dataIndex: 'name' },
			{
				title: <QuantitySelect onQuantityTypeChange={onQuantityTypeChange} />,
				dataIndex: 'quantity',
			},
		],
		[onQuantityTypeChange],
	);

	const onChangePreparingBranch = (branchId) => {
		getPurchaseRequestsByIdAndBranch(purchaseRequestId, branchId);
		setSelectedBranchId(branchId);
	};

	const onCreateOrderSlip = () => {
		setSelectedOrderSlip(null);
		onChangePreparingBranch(branches?.[0]?.id);
		setCreateEditOrderSlipVisible(true);
	};

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
			purchase_request_id: purchaseRequest.id,
			products,
		};

		createOrderSlip(data);
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
				id: selectedOrderSlip.id,
				assigned_store_id: selectedBranchId,
				products,
			};

			editOrderSlip(data);
		} else {
			message.error('Must have at least 1 product in order slip.');
		}
	};

	// const onCreateDeliveryReceipt = () => {};

	const onStatusChange = (status) => {
		editPurchaseRequest(purchaseRequestId, status);
	};

	return (
		<Container
			title="[VIEW] F-RS01"
			rightTitle={`#${purchaseRequest?.id}`}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			<section className="ViewPurchaseRequest">
				<RequestedProducts
					datetimeCreated={purchaseRequest?.datetime_created}
					requestor={getRequestor()}
					type={purchaseRequest?.type}
					action={purchaseRequest?.action?.action}
					onStatusChange={onStatusChange}
					columns={getRequestProductsColums()}
					data={requestedProductsData}
				/>

				<OrderSlipList
					// Table Header
					onCreateOrderSlip={onCreateOrderSlip}
					// Table
					orderSlips={orderSlipsData}
					purchaseRequestStatus={purchaseRequestStatus}
					// View Order Slip Modal
					viewOrderSlipVisible={viewOrderSlipVisible}
					onCloseViewOrderSlip={() => setViewOrderSlipVisible(false)}
					orderSlip={selectedOrderSlip}
					// Creat Edit Order Slip Modal
					branches={branches}
					purchaseRequest={purchaseRequest}
					purchaseRequestProducts={purchaseRequestProducts}
					selectedBranchId={selectedBranchId}
					onChangePreparingBranch={onChangePreparingBranch}
					assignedPersonnelOptions={assignedPersonnelOptions}
					createEditOrderSlipVisible={createEditOrderSlipVisible}
					onCreateEditOrderSlip={
						selectedOrderSlip ? onEditOrderSlipSubmit : onCreateOrderSlipSubmit
					}
					onCloseCreateEditOrderSlip={() => setCreateEditOrderSlipVisible(false)}
				/>
			</section>
		</Container>
	);
};

export default ViewPurchaseRequest;
