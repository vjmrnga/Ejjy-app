/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Table, TableActions, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { types } from '../../../ducks/products';
import { selectors as authSelectors } from '../../../ducks/auth';
import { request } from '../../../global/variables';
import { useProducts } from '../../../hooks/useProducts';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';
import { usePurchaseRequests } from '../hooks/usePurchaseRequests';

const columns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Requested', dataIndex: 'Type' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'actions' },
];

const PurchaseRequests = () => {
	const { height } = useWindowDimensions();
	const user = useSelector(authSelectors.selectUser());

	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [createEditProductModalVisible, setCreateEditProductModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const {
		purchaseRequests,
		getPurchaseRequests,
		getPurchaseRequestsExtended,
		createPurchaseRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	} = usePurchaseRequests(user?.branch_id);

	useEffect(() => {
		getPurchaseRequestsExtended();
	}, []);

	// Effect: Format purchaseRequests to be rendered in Table
	useEffect(() => {
		const formattedProducts = purchaseRequests.map((purchaseRequest) => {
			const {
				id,
				datetime_created,
				type,
				action: { action },
			} = purchaseRequests;

			return {
				_id: id,
				_datetime_created: datetime_created,
				_type: type,
				id,
				datetime_created,
				type,

				actions: <TableActions onEdit={() => onEdit(product)} onRemove={() => removeProduct(id)} />,
			};
		});

		setData(formattedProducts);
		setTableData(formattedProducts);
	}, [purchaseRequests]);

	// // Effect: Reload the list if recent requests are Create, Edit or Remove
	// useEffect(() => {
	// 	const reloadListTypes = [types.CREATE_PRODUCT, types.EDIT_PRODUCT];

	// 	if (status === request.SUCCESS && reloadListTypes.includes(recentRequest)) {
	// 		setCreateEditProductModalVisible(false);
	// 		setSelectedProduct(null);
	// 	}
	// }, [status, recentRequest]);

	const onCreate = () => {
		setSelectedProduct(null);
		setCreateEditProductModalVisible(true);
	};

	const onEdit = (product) => {
		setSelectedProduct(product);
		setCreateEditProductModalVisible(true);
	};

	const onSearch = (keyword) => {
		const filteredData =
			keyword.length > 0
				? data.filter(({ _barcode, name }) => _barcode.includes(keyword) || name.includes(keyword))
				: data;

		setTableData(filteredData);
	};

	const onStatusSelect = (status) => {
		// const filteredData =
		// status
		// 		? data.filter(({ _barcode, name }) => _barcode.includes(keyword) || name.includes(keyword))
		// 		: data;
		// setTableData(filteredData);
	};

	return (
		<Container title="Purchase Requests">
			<section className="Purchase Requests">
				<Box>
					<TableHeader
						buttonName="Create Purchase Request"
						onStatusSelect={onStatusSelect}
						onSearch={onSearch}
						onCreate={onCreate}
					/>

					<Table
						columns={columns}
						dataSource={tableData}
						scroll={{ y: height * 0.6, x: '100vw' }}
					/>

					{/* <CreateEditProductModal
						product={selectedProduct}
						visible={createEditProductModalVisible}
						onSubmit={selectedProduct ? editProduct : createProduct}
						onClose={() => setCreateEditProductModalVisible(false)}
						errors={errors}
						loading={status === request.REQUESTING}
					/>  */}
				</Box>
			</section>
		</Container>
	);
};

export default PurchaseRequests;
