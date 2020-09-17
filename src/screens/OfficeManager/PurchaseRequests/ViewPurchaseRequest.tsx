/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb, Container, QuantitySelect, Table, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { selectors } from '../../../ducks/purchase-requests';
import { quantityTypes, request } from '../../../global/variables';
import { useProducts } from '../../../hooks/useProducts';
import { usePurchaseRequests } from '../../../hooks/usePurchaseRequests';
import { calculateTableHeight, sleep } from '../../../utils/function';
import { useBranches } from '../hooks/useBranches';
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
	const purchaseRequestId = match?.params?.id;

	const { products, status: productStatus, getProducts } = useProducts();
	const { branches, status: branchStatus, getBranches } = useBranches();
	const { status: purchaseRequestStatus, getPurchaseRequestsExtended } = usePurchaseRequests();
	const purchaseRequest = useSelector(
		selectors.selectPurchaseRequestById(Number(purchaseRequestId)),
	);

	const [requestedProductsData, setRequestProductsData] = useState([]);
	const [createEditOrderSlipVisible, setCreateEditOrderSlipVisible] = useState(false);
	const [viewOrderSlipVisible, setViewOrderSlipVisible] = useState(false);

	useEffect(() => {
		getProducts();
		getBranches();
		getPurchaseRequestsExtended();
	}, []);

	// Effect: Format requested products to be rendered in Table
	useEffect(() => {
		if (
			purchaseRequest &&
			purchaseRequestStatus === request.SUCCESS &&
			products.length &&
			productStatus === request.SUCCESS
		) {
			const formattedRequestedProducts = purchaseRequest?.products.map((requestedProduct) => {
				const { product_id, quantity_bulk, quantity_piece } = requestedProduct;
				const product = products.find(({ id }) => id === product_id);
				const { barcode = '', name = '' } = product;

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
	}, [purchaseRequest, products, productStatus]);

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

	return (
		<Container
			title="[VIEW] F-RS01"
			rightTitle={`#${purchaseRequest?.id}`}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			<section className="ViewPurchaseRequest">
				<RequestedProducts
					datetimeCreated={purchaseRequest?.datetime_created}
					requestor={purchaseRequest?.requestor_id}
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
						onCreate={() => setViewOrderSlipVisible(true)}
					/>

					<Table
						columns={orderSlipsColumns}
						dataSource={[]}
						scroll={{ y: calculateTableHeight([].length), x: '100vw' }}
						loading={
							purchaseRequestStatus === request.REQUESTING || productStatus === request.REQUESTING
						}
					/>

					<ViewOrderSlipModal
						visible={viewOrderSlipVisible}
						orderSlip={null}
						onClose={() => setViewOrderSlipVisible(false)}
					/>

					<CreateEditOrderSlipModal
						requestedProducts={[]}
						branchesOptions={[]}
						assignedPersonnelOptions={[]}
						dateTimeRequested="test"
						requestingBranch="test"
						purchaseRequestId="test"
						visible={createEditOrderSlipVisible}
						onSubmit={null}
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
