import { Button, Col, Modal, Row, Table } from 'antd';
import { RequestErrors } from 'components/RequestErrors';
import { TimeRangeFilter } from 'components/TimeRangeFilter';
import {
	AUTOMATIC_GENERATED_REPORT_USER_NAME,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	ViewZReadReportModal,
	ZReadReport,
	convertIntoArray,
	formatDateTime,
	getFullName,
	useQueryParams,
	useZReadReports,
} from 'ejjy-global';
import { useSiteSettingsNew } from 'hooks';
import React, { useEffect, useState } from 'react';

const columns = [
	{ title: 'Date', dataIndex: 'datetimeCreated' },
	{ title: 'User', dataIndex: 'user' },
];

const TIME_RANGE_PARAM_KEY = 'zreadTimeRange';

interface Props {
	branchMachine: any;
	onClose: any;
}

export const ViewZReadReportsModal = ({ branchMachine, onClose }: Props) => {
	// STATES
	const [selectedZReadReport, setSelectedZReadReport] = useState<ZReadReport>();
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const { data: siteSettings } = useSiteSettingsNew();

	const {
		data: zReadReportsData,
		isFetching: isFetchingZReadReports,
		error: zReadReportsError,
	} = useZReadReports({
		params: {
			...params,
			timeRange: params[TIME_RANGE_PARAM_KEY] as string,
			branchMachineName: branchMachine.name,
		},
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
				user: report.generated_by
					? getFullName(report.generated_by)
					: AUTOMATIC_GENERATED_REPORT_USER_NAME,
			}));

			setDataSource(data);
		}
	}, [zReadReportsData?.list]);

	return (
		<Modal
			className="Modal__hasFooter Modal__large"
			footer={<Button onClick={onClose}>Close</Button>}
			title="Z-Read Reports"
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
