/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { floor } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Breadcrumb, Container, QuantitySelect, Table, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { selectors, types } from '../../../ducks/purchase-requests';
import { purchaseRequestProductStatus, quantityTypes, request } from '../../../global/variables';
import { usePurchaseRequests } from '../../../hooks/usePurchaseRequests';
import { calculateTableHeight, formatDateTime, sleep } from '../../../utils/function';
import { useBranches } from '../hooks/useBranches';
import { useOrderSlip } from '../hooks/useOrderSlip';
import { CreateEditOrderSlipModal } from './components/CreateEditOrderSlipModal';
import { RequestedProducts } from './components/RequestedProducts';
import { ViewOrderSlipModal } from './components/ViewOrderSlipModal';
import './style.scss';

interface Props {
	match: any;
}

const orderSlipsColumns = [
	{ title: 'ID', dataIndex: 'barcode' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'DR Status', dataIndex: 'dr_status' },
	{ title: 'Actions', dataIndex: 'actions' },
];

const ViewPurchaseRequest = ({ match }: Props) => {
	// Routing
	const purchaseRequestId = match?.params?.id;
	const history = useHistory();

	// Custom hooks
	const { branches } = useBranches();
	const {
		getPurchaseRequestsById,
		getPurchaseRequestsByIdAndBranch,
		status: purchaseRequestStatus,
		recentRequest: purchaseRequestRecentRequest,
	} = usePurchaseRequests();
	const {
		orderSlips,
		getOrderSlipsExtended,
		createOrderSlip,
		status: orderSlipStatus,
		recentRequest: orderSlipRecentRequest,
	} = useOrderSlip();
	const purchaseRequest = useSelector(selectors.selectPurchaseRequest());
	const purchaseRequestsByBranch = useSelector(selectors.selectPurchaseRequestsByBranch());

	// States
	const [selectedBranchId, setSelectedBranchId] = useState(null);
	const [requestedProductsData, setRequestProductsData] = useState([]);
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
				const { product, quantity_piece, quantity_bulk } = requestedProduct;
				const { barcode, name } = product;

				return {
					_quantity_bulk: quantity_bulk,
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
			purchaseRequestStatus === request.SUCCESS &&
			purchaseRequestRecentRequest === types.GET_PURCHASE_REQUEST_BY_ID_AND_BRANCH
		) {
			const branchData = purchaseRequestsByBranch?.[selectedBranchId];
			if (branchData) {
				const { branch_personnels, products } = branchData;
				const personnelOptions = branch_personnels.map((personnel) => ({
					value: personnel.id,
					name: `${personnel.first_name} ${personnel.last_name}`,
				}));

				const requestedProducts = products.map((product) => {
					const { name, id, pieces_in_bulk } = product.product.product;
					const { quantity_piece, quantity_bulk } = product.product;
					const { current, max_balance } = product.branch_balance;

					return {
						selected: product.status === purchaseRequestProductStatus.NOT_ADDED_TO_OS,
						product_id: id,
						product_name: name,
						product_barcode: id,
						quantity: '',
						quantity_piece,
						quantity_bulk,
						quantity_type: quantityTypes.PIECE,
						branch_current: current,
						branch_max_balance: max_balance,
						branch_current_bulk: floor(current / pieces_in_bulk),
						branch_max_balance_bulk: floor(max_balance / pieces_in_bulk),
						assigned_personnel: personnelOptions?.[0]?.value,
					};
				});

				setAssignedPersonnelOptions(personnelOptions);
				setPurchaseRequestProducts(requestedProducts);
			}
		}
	}, [
		selectedBranchId,
		purchaseRequestsByBranch,
		purchaseRequestStatus,
		purchaseRequestRecentRequest,
	]);

	const getBranchOptions = useCallback(
		() =>
			branches.map((branch) => ({
				value: branch?.id,
				name: branch?.name,
			})),
		[branches],
	);

	const onStatusChange = (status) => {
		console.log(status);
	};

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

	const onCreateOrderSlip = (values) => {
		const products = values.requestedProducts.map((product) => ({
			product_id: product.product_id,
			quantity_piece: product.quantity_type === quantityTypes.PIECE ? product.quantity : undefined,
			quantity_bulk: product.quantity_type === quantityTypes.BULK ? product.quantity : undefined,
			assigned_person_id: product.assigned_personnel,
		}));

		const data = {
			requesting_user_id: purchaseRequest.requesting_user.id,
			assigned_store_id: selectedBranchId,
			purchase_request_id: purchaseRequest.id,
			products,
		};

		createOrderSlip(data);
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

				<Box>
					<TableHeader
						title="F-OS1"
						buttonName="Create Order Slip"
						onCreate={() => setCreateEditOrderSlipVisible(true)}
					/>

					<Table
						columns={orderSlipsColumns}
						dataSource={[]}
						scroll={{ y: calculateTableHeight([].length), x: '100vw' }}
						loading={purchaseRequestStatus === request.REQUESTING}
					/>

					<ViewOrderSlipModal
						visible={viewOrderSlipVisible}
						orderSlip={null}
						onClose={() => setViewOrderSlipVisible(false)}
					/>

					<CreateEditOrderSlipModal
						requestedProducts={purchaseRequestProducts}
						branchOptions={getBranchOptions()}
						onChangePreparingBranch={onChangePreparingBranch}
						assignedPersonnelOptions={assignedPersonnelOptions}
						dateTimeRequested={formatDateTime(purchaseRequest?.datetime_created)}
						requestingBranch={purchaseRequest?.requesting_user?.branch.name}
						purchaseRequestId={purchaseRequest?.id}
						visible={createEditOrderSlipVisible}
						onSubmit={onCreateOrderSlip}
						onClose={() => setCreateEditOrderSlipVisible(false)}
						errors={[]}
						loading={false}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default ViewPurchaseRequest;
