import { Button, Col, Modal, Row, Table, Tag } from 'antd';
import { RequestErrors } from 'components/RequestErrors';
import { TimeRangeFilter } from 'components/TimeRangeFilter';
import {
	AUTOMATIC_GENERATED_REPORT_USER_NAME,
	BranchMachine,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	ViewZReadReportModal,
	ZReadReport,
	convertIntoArray,
	formatDateTime,
	getFullName,
	useZReadReports,
	ReportCategory,
	reportCategories,
} from 'ejjy-global';
import { useQueryParams, useSiteSettingsNew } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useUserStore } from 'stores';

const columns = [
	{ title: 'Date', dataIndex: 'datetimeCreated' },
	{ title: 'User', dataIndex: 'user' },
];

const TIME_RANGE_PARAM_KEY = 'zreadTimeRange';

interface Props {
	branchMachine: BranchMachine;
	category: ReportCategory;
	onClose: () => void;
}

// TODO: We only used machine server URL because this was not added to the syncing yet.
const MACHINE_SERVER_URL = 'http://localhost:8005/v1';

export const ViewZReportsModal = ({
	branchMachine,
	category,
	onClose,
}: Props) => {
	// STATES
	const [selectedZReadReport, setSelectedZReadReport] = useState<ZReadReport>();
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const user = useUserStore((state) => state.user);
	const { data: siteSettings } = useSiteSettingsNew();
	const {
		data: zReadReportsData,
		isFetching: isFetchingZReadReports,
		error: zReadReportsError,
	} = useZReadReports({
		params: {
			...params,
			branchMachineName: branchMachine.name,
			timeRange: params[TIME_RANGE_PARAM_KEY] as string,
		},
		serviceOptions: { baseURL: MACHINE_SERVER_URL },
	});

	// METHODS
	useEffect(() => {
		if (zReadReportsData?.list) {
			const data = zReadReportsData.list.map((report) => ({
				key: report.id,
				datetimeCreated: (
					<Button
						className="pa-0"
						type="link"
						onClick={() => {
							setSelectedZReadReport(report);
						}}
					>
						{formatDateTime(report.generation_datetime)}
					</Button>
				),
				user: report.generated_by ? (
					getFullName(report.generated_by)
				) : (
					<Tag color="blue">{AUTOMATIC_GENERATED_REPORT_USER_NAME}</Tag>
				),
			}));

			setDataSource(data);
		}
	}, [zReadReportsData?.list]);

	return (
		<Modal
			className="Modal__hasFooter Modal__large"
			footer={<Button onClick={onClose}>Close</Button>}
			title={`Z-${
				category === reportCategories.EJournals ? 'report' : 'accrued'
			} Reports`}
			centered
			closable
			open
			onCancel={onClose}
		>
			<Filter isLoading={isFetchingZReadReports} />

			<RequestErrors
				errors={convertIntoArray(zReadReportsError)}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingZReadReports}
				pagination={{
					current: Number(params.page) || DEFAULT_PAGE,
					total: zReadReportsData?.total || 0,
					pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
					onChange: (page) => {
						setQueryParams({ page }, { shouldResetPage: false });
					},
					disabled: !dataSource,
					showSizeChanger: false,
					position: ['bottomCenter'],
				}}
			/>

			{selectedZReadReport && (
				<ViewZReadReportModal
					report={selectedZReadReport}
					siteSettings={siteSettings}
					user={user}
					onClose={() => setSelectedZReadReport(null)}
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
