import React, { useCallback, useEffect, useState } from 'react';
import { Container, Table, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { calculateTableHeight } from '../../../utils/function';
import './style.scss';

const columns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'action' },
];

const PreparationSlips = () => {
	// const {
	// 	purchaseRequests,
	// 	getPurchaseRequestsExtended,
	// 	status,
	// 	recentRequest,
	// } = usePurchaseRequests();

	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		// getPurchaseRequestsExtended();
	}, []);

	// Effect: Format purchaseRequests to be rendered in Table
	// useEffect(() => {
	// 	const formattedProducts = purchaseRequests.map((purchaseRequest) => {
	// 		const { id, type, requestor_id, action: prAction } = purchaseRequest;
	// 		const { datetime_created, action } = prAction;
	// 		const dateTime = formatDateTime(datetime_created);

	// 		return {
	// 			_id: id,
	// 			_datetime_created: dateTime,
	// 			_type: type,
	// 			_status: action,
	// 			id: <Link to={`/purchase-requests/${id}`}>{id}</Link>,
	// 			datetime_created: dateTime,
	// 			requestor: requestor_id,
	// 			type: upperFirst(type),
	// 			action: getPurchaseRequestStatus(action),
	// 		};
	// 	});

	// 	setData(formattedProducts);
	// 	setTableData(formattedProducts);
	// }, [purchaseRequests]);

	// const getFetchLoading = useCallback(
	// 	() => status === request.REQUESTING && recentRequest === types.GET_PURCHASE_REQUESTS_EXTENDED,
	// 	[status, recentRequest],
	// );

	// const onSearch = (keyword) => {
	// 	keyword = lowerCase(keyword);
	// 	const filteredData =
	// 		keyword.length > 0
	// 			? data.filter(
	// 					({ _id, _datetime_created, _type }) =>
	// 						_id.toString() === keyword ||
	// 						_datetime_created.includes(keyword) ||
	// 						_type.includes(keyword),
	// 			  )
	// 			: data;

	// 	setTableData(filteredData);
	// };

	// const onStatusSelect = (status) => {
	// 	const filteredData = status !== 'all' ? data.filter(({ _status }) => _status === status) : data;
	// 	setTableData(filteredData);
	// };

	return (
		<Container
			title="Preparation Slips"
			loading={false}
			loadingText="Fetching preparation slips..."
		>
			<section className="PurchaseRequests">
				<Box>
					<TableHeader statuses={[]} onStatusSelect={null} onSearch={null} />

					<Table
						columns={columns}
						dataSource={tableData}
						scroll={{ y: calculateTableHeight(tableData.length), x: '100%' }}
						// loading={status === request.REQUESTING}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default PreparationSlips;
