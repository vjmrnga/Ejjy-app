import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AddButtonIcon, Content, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { selectors as authSelectors } from '../../../ducks/auth';
import { request } from '../../../global/types';
import { formatDateTime } from '../../../utils/function';
import { useProductChecks } from '../hooks/useProductChecks';
import { DailyCheckCard } from './components/DailyCheckCard';
import { FulfillCheckModal } from './components/FulfillCheckModal';
import './style.scss';

const columns: ColumnsType = [
	{ title: 'Date & Time Requested', dataIndex: 'datetime_requested' },
	{ title: 'Action', dataIndex: 'action' },
];

export const Checking = () => {
	const user = useSelector(authSelectors.selectUser());
	const { dailyCheck, randomChecks, getDailyCheck, getRandomChecks, status } =
		useProductChecks();

	const [randomChecksDataSource, setRandomChecksDataSource] = useState([]);
	const [selectedProductCheck, setSelectedProductCheck] = useState(null);
	const [fulfillModalVisible, setFulfillModalVisible] = useState(false);

	useEffect(() => {
		fetchDailyCheck();
		fetchRandomChecks();
	}, []);

	// Effect: Format random checks
	useEffect(() => {
		if (randomChecks) {
			const formattedRandomChecks = randomChecks?.map((randomCheck) => ({
				datetime_requested: formatDateTime(randomCheck?.datetime_created),
				action: (
					<AddButtonIcon
						tooltip="Fulfill random check"
						onClick={() => onRandomCheck(randomCheck)}
					/>
				),
			}));

			setRandomChecksDataSource(formattedRandomChecks);
		}
	}, [randomChecks]);

	const fetchDailyCheck = () => {
		getDailyCheck(user?.branch?.id);
	};

	const fetchRandomChecks = () => {
		getRandomChecks(user?.branch?.id);
	};

	const onRandomCheck = (randomCheck) => {
		setFulfillModalVisible(true);
		setSelectedProductCheck(randomCheck);
	};

	const onDailyCheck = () => {
		setFulfillModalVisible(true);
		setSelectedProductCheck(dailyCheck);
	};

	return (
		<Content className="Checking" title="Checking">
			<section>
				{dailyCheck && (
					<DailyCheckCard
						onDailyCheck={onDailyCheck}
						dateTimeRequested={dailyCheck?.datetime_created}
					/>
				)}

				<Box>
					<TableHeader title="Random Checks" />
					<Table
						columns={columns}
						dataSource={randomChecksDataSource}
						scroll={{ x: 650 }}
						pagination={false}
						loading={status === request.REQUESTING}
					/>
				</Box>

				<FulfillCheckModal
					productCheck={selectedProductCheck}
					visible={fulfillModalVisible}
					onClose={() => setFulfillModalVisible(false)}
				/>
			</section>
		</Content>
	);
};
