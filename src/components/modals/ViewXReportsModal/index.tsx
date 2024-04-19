import { Button, Col, Modal, Row, Table, Tag } from 'antd';
import { RequestErrors } from 'components/RequestErrors';
import { TimeRangeFilter } from 'components/TimeRangeFilter';
import {
	BranchMachine,
	getFullName,
	reportCategories,
	ReportCategory,
	useXReadReports,
	ViewXReadReportModal,
} from 'ejjy-global';
import {
	AUTOMATIC_GENERATED_REPORT_USER_NAME,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
} from 'global';
import { useQueryParams, useSiteSettingsNew } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import { convertIntoArray, formatDateTime } from 'utils';

const columns = [
	{ title: 'Date', dataIndex: 'datetimeCreated' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'User', dataIndex: 'user' },
];

const TIME_RANGE_PARAM_KEY = 'xreadTimeRange';
interface Props {
	branchMachine: BranchMachine;
	category: ReportCategory;
	onClose: () => void;
}

// TODO: We only used machine server URL because this was not added to the syncing yet.
const MACHINE_SERVER_URL = 'http://localhost:8005/v1';

export const ViewXReportsModal = ({
	branchMachine,
	category,
	onClose,
}: Props) => {
	// STATES
	const [selectedXReadReport, setSelectedXReadReport] = useState(null);
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const user = useUserStore((state) => state.user);
	const { data: siteSettings } = useSiteSettingsNew();
	const {
		data: xReadReportsData,
		isFetching: isFetchingXReadReports,
		error: xReadReportsError,
	} = useXReadReports({
		params: {
			...params,
			branchMachineName: branchMachine.name,
			timeRange: params[TIME_RANGE_PARAM_KEY] as string,
		},
		serviceOptions: { baseURL: MACHINE_SERVER_URL },
	});

	// METHODS
	useEffect(() => {
		if (xReadReportsData?.list) {
			const data = xReadReportsData.list.map((report) => ({
				key: report.id,
				datetimeCreated: (
					<Button
						className="pa-0"
						type="link"
						onClick={() => setSelectedXReadReport(report)}
					>
						{formatDateTime(report.generation_datetime)}
					</Button>
				),
				type: report.cashiering_session ? (
					<Tag color="orange">Current Session</Tag>
				) : (
					<Tag color="green">Date</Tag>
				),
				user: report.generated_by ? (
					getFullName(report.generated_by)
				) : (
					<Tag color="blue">{AUTOMATIC_GENERATED_REPORT_USER_NAME}</Tag>
				),
			}));

			setDataSource(data);
		}
	}, [xReadReportsData?.list]);

	return (
		<Modal
			className="Modal__hasFooter Modal__large"
			footer={<Button onClick={onClose}>Close</Button>}
			title={`X-${
				category === reportCategories.EJournals ? 'report' : 'accrued'
			} Reports`}
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
					total: xReadReportsData?.total || 0,
					pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
					onChange: (page) => {
						setQueryParams({ page }, { shouldResetPage: false });
					},
					disabled: !dataSource,
					showSizeChanger: false,
					position: ['bottomCenter'],
				}}
			/>

			{selectedXReadReport && siteSettings && (
				<ViewXReadReportModal
					report={selectedXReadReport}
					siteSettings={siteSettings}
					user={user}
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
