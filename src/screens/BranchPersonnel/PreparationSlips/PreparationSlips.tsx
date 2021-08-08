/* eslint-disable no-mixed-spaces-and-tabs */
import { lowerCase } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	AddButtonIcon,
	Content,
	Table,
	TableHeader,
} from '../../../components';
import { Box, ButtonLink } from '../../../components/elements';
import { types } from '../../../ducks/BranchPersonnel/preparation-slips';
import { preparationSlipStatusOptions } from '../../../global/options';
import { preparationSlipStatus, request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import {
	calculateTableHeight,
	formatDateTime,
	getPreparationSlipStatus,
} from '../../../utils/function';
import { useOrderSlips } from '../../BranchManager/hooks/useOrderSlips';
import { usePreparationSlips } from '../hooks/usePreparationSlips';
import { ViewPreparationSlipModal } from './components/ViewPreparationSlipModal';
import './style.scss';

const columns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'action' },
];

export const PreparationSlips = () => {
	// STATES
	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [viewPreparationSlipModalVisible, setViewPreparationSlipModalVisible] =
		useState(false);
	const [selectedPreparationSlip, setSelectedPreparationSlip] = useState(null);
	const [pendingCount, setPendingCount] = useState(0);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const {
		preparationSlips,
		getPreparationSlips,
		status: preparationSlipsStatus,
		recentRequest,
	} = usePreparationSlips();
	const { getPendingCount } = useOrderSlips();

	// METHODS
	useEffect(() => {
		getPreparationSlips(user.id);
		getPendingCount({ userId: user.id }, ({ status, data: count }) => {
			if (status === request.SUCCESS) {
				setPendingCount(count);
			}
		});
	}, []);

	useEffect(() => {
		const formattedPreparationSlips = preparationSlips.map(
			(preparationSlip) => {
				const { id, datetime_created, status } = preparationSlip;
				const dateTime = formatDateTime(datetime_created);

				const action =
					status === preparationSlipStatus.NEW ? (
						<AddButtonIcon
							onClick={() => {
								history.push(
									`/branch-personnel/preparation-slips/${preparationSlip.id}`,
								);
							}}
							tooltip="Fulfill"
						/>
					) : null;

				return {
					_id: id,
					_datetime_created: dateTime,
					_status: status,
					id: <ButtonLink text={id} onClick={() => onView(preparationSlip)} />,
					datetime_created: dateTime,
					status: getPreparationSlipStatus(status),
					action,
				};
			},
		);

		setData(formattedPreparationSlips);
		setTableData(formattedPreparationSlips);
	}, [preparationSlips]);

	const getFetchLoading = useCallback(
		() =>
			preparationSlipsStatus === request.REQUESTING &&
			recentRequest === types.GET_PREPARATION_SLIPS,
		[preparationSlipsStatus, recentRequest],
	);

	const onView = (preparationSlip) => {
		setSelectedPreparationSlip(preparationSlip);
		setViewPreparationSlipModalVisible(true);
	};

	const onSearch = (keyword) => {
		const lowerCaseKeyword = lowerCase(keyword);
		const filteredData =
			lowerCaseKeyword.length > 0
				? data.filter(
						({ _id, _datetime_created }) =>
							_id.toString() === lowerCaseKeyword ||
							_datetime_created.includes(lowerCaseKeyword),
				  )
				: data;

		setTableData(filteredData);
	};

	const onStatusSelect = (status) => {
		const filteredData =
			status !== 'all'
				? data.filter(({ _status }) => _status === status)
				: data;
		setTableData(filteredData);
	};

	return (
		<Content title="Preparation Slips">
			<Box>
				<TableHeader
					statuses={preparationSlipStatusOptions}
					onStatusSelect={onStatusSelect}
					onSearch={onSearch}
					pending={pendingCount}
				/>

				<Table
					columns={columns}
					dataSource={tableData}
					scroll={{ y: calculateTableHeight(tableData.length), x: '100%' }}
					loading={getFetchLoading()}
				/>

				<ViewPreparationSlipModal
					preparationSlip={selectedPreparationSlip}
					visible={viewPreparationSlipModalVisible}
					onClose={() => setViewPreparationSlipModalVisible(false)}
				/>
			</Box>
		</Content>
	);
};
