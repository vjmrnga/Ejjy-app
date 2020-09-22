/* eslint-disable react-hooks/exhaustive-deps */
import { lowerCase } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Container, Table, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { types } from '../../../ducks/BranchPersonnel/preparation-slips';
import { preparationSlipStatusOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { calculateTableHeight } from '../../../utils/function';
import { usePreparationSlips } from '../hooks/usePreparationSlips';
import { FulfillPreparationSlipModal } from './components/FulfillPreparationSlipModal';
import { ViewPreparationSlipModal } from './components/ViewPreparationSlipModal';
import './style.scss';

const columns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'action' },
];

const PreparationSlips = () => {
	const {
		preparationSlips,
		getPreparationSlipsExtended,
		status,
		recentRequest,
	} = usePreparationSlips();

	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [viewPreparationSlipModalVisible, setViewPreparationSlipModalVisible] = useState(false);
	const [fulfillModalVisible, setFulfillModalVisible] = useState(false);
	const [selectedPreparationSlip, setSelectedPreparationSlip] = useState(null);

	useEffect(() => {
		getPreparationSlipsExtended();
	}, []);

	// Effect: Format preparation slips to be rendered in Table
	useEffect(() => {
		// const formattedPreparationSlips = preparationSlips.map((preparationSlip) => {
		// 	const { id, datetime_created, status, actions} = preparationSlip;
		// 	const dateTime = formatDateTime(datetime_created);

		// 	return {
		// 		_id: id,
		// 		_datetime_created: dateTime,
		// 		_type: type,
		// 		_status: action,
		// 		id: <Link to={`/purchase-requests/${id}`}>{id}</Link>,
		// 		datetime_created: dateTime,
		// 		requestor: requestor_id,
		// 		type: upperFirst(type),
		// 		action: getPurchaseRequestStatus(action),
		// 	};
		// });

		const formattedPreparationSlips = [];

		setData(formattedPreparationSlips);
		setTableData(formattedPreparationSlips);
	}, [preparationSlips]);

	const getFetchLoading = useCallback(
		() => status === request.REQUESTING && recentRequest === types.GET_PREPARATION_SLIPS_EXTENDED,
		[status, recentRequest],
	);

	const onView = (preparationSlip) => {
		setSelectedPreparationSlip(preparationSlip);
		setViewPreparationSlipModalVisible(true);
	};

	const onFulfill = (preparationSlip) => {
		setSelectedPreparationSlip(preparationSlip);
		setFulfillModalVisible(true);
	};

	const onSearch = (keyword) => {
		keyword = lowerCase(keyword);
		const filteredData =
			keyword.length > 0
				? data.filter(
						({ _id, _datetime_created }) =>
							_id.toString() === keyword || _datetime_created.includes(keyword),
				  )
				: data;

		setTableData(filteredData);
	};

	const onStatusSelect = (status) => {
		const filteredData = status !== 'all' ? data.filter(({ _status }) => _status === status) : data;
		setTableData(filteredData);
	};

	return (
		<Container
			title="Preparation Slips"
			loading={getFetchLoading()}
			loadingText="Fetching preparation slips..."
		>
			<section className="PurchaseRequests">
				<Box>
					<TableHeader
						statuses={preparationSlipStatusOptions}
						onStatusSelect={onStatusSelect}
						onSearch={onSearch}
					/>

					<Table
						columns={columns}
						dataSource={tableData}
						scroll={{ y: calculateTableHeight(tableData.length), x: '100%' }}
					/>

					<ViewPreparationSlipModal
						visible={viewPreparationSlipModalVisible}
						preparationSlip={null}
						onClose={() => setViewPreparationSlipModalVisible(false)}
					/>

					<FulfillPreparationSlipModal
						preparationSlip={selectedPreparationSlip}
						visible={fulfillModalVisible}
						onClose={() => setFulfillModalVisible(false)}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default PreparationSlips;
