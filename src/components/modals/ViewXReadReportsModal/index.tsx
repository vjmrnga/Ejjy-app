import { Button, Col, Modal, Row, Table, Tag } from 'antd';
import { RequestErrors } from 'components/RequestErrors';
import { TimeRangeFilter } from 'components/TimeRangeFilter';
import { ViewXReadReportModal } from 'components/modals/ViewXReadReportModal';
import {
	AUTOMATIC_GENERATED_REPORT_USER_NAME,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
} from 'global';
import { useQueryParams, useXreadReports } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDateTime, getFullName } from 'utils';

const columns = [
	{ title: 'Date', dataIndex: 'datetimeCreated' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'User', dataIndex: 'user' },
];

const TIME_RANGE_PARAM_KEY = 'xreadTimeRange';
interface Props {
	branchMachine: any;
	onClose: any;
}

export const ViewXReadReportsModal = ({ branchMachine, onClose }: Props) => {
	// STATES
	const [selectedXReadReport, setSelectedXReadReport] = useState(null);
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { xReadReports, total },
		isFetching: isFetchingXReadReports,
		error: xReadReportsError,
	} = useXreadReports({
		params: {
			...params,
			timeRange: params[TIME_RANGE_PARAM_KEY],
			branchMachineName: branchMachine.name,
		},
	});

	// METHODS
	useEffect(() => {
		const formattedReports = xReadReports.map((report) => ({
			key: report.id,
			datetimeCreated: (
				<Button
					className="pa-0"
					type="link"
					onClick={() => {
						setSelectedXReadReport(report);
					}}
				>
					{formatDateTime(report.generation_datetime)}
				</Button>
			),
			type: report.cashiering_session ? (
				<Tag color="orange">Current Session</Tag>
			) : (
				<Tag color="green">Date</Tag>
			),
			user: report.generated_by
				? getFullName(report.generated_by)
				: AUTOMATIC_GENERATED_REPORT_USER_NAME,
		}));

		setDataSource(formattedReports);
	}, [xReadReports]);

	return (
		<Modal
			className="Modal__hasFooter Modal__large"
			footer={<Button onClick={onClose}>Close</Button>}
			title="X-Read Reports"
			centered
			closable
			open
			onCancel={onClose}
		>
			<Filter isLoading={isFetchingXReadReports} />

			<RequestErrors
				errors={convertIntoArray(xReadReportsError)}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingXReadReports}
				pagination={{
					current: Number(params.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
					onChange: (page) => {
						setQueryParams({ page }, { shouldResetPage: false });
					},
					disabled: !dataSource,
					showSizeChanger: false,
					position: ['bottomCenter'],
				}}
			/>

			{selectedXReadReport && (
				<ViewXReadReportModal
					report={selectedXReadReport}
					onClose={() => setSelectedXReadReport(null)}
				/>
			)}
		</Modal>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => (
	<Row className="mb-4" gutter={[16, 16]}>
		<Col lg={12} span={24}>
			<TimeRangeFilter disabled={isLoading} queryName={TIME_RANGE_PARAM_KEY} />
		</Col>
	</Row>
);
