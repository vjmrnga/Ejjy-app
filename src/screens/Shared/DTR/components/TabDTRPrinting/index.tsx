import { FilePdfOutlined } from '@ant-design/icons';
import { Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import { Label } from 'components/elements';
import { printDtr } from 'configurePrinter';
import dayjs from 'dayjs';
import {
	accountTypes,
	EMPTY_CELL,
	JSPDF_SETTINGS,
	MAX_PAGE_SIZE,
	timeRangeTypes,
} from 'global';
import {
	useAccounts,
	useAttendanceLogsForPrinting,
	useQueryParams,
} from 'hooks';
import jsPDF from 'jspdf';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	formatTimeOnly,
	getFullName,
} from 'utils';

const columns: ColumnsType = [
	{
		title: 'Day',
		dataIndex: 'day',
	},
	{
		title: 'A.M.',
		children: [
			{
				title: 'Arrival',
				dataIndex: 'amArrival',
			},
			{
				title: 'Departure',
				dataIndex: 'amDeparture',
			},
		],
	},
	{
		title: 'P.M.',
		children: [
			{
				title: 'Arrival',
				dataIndex: 'pmArrival',
			},
			{
				title: 'Departure',
				dataIndex: 'pmDeparture',
			},
		],
	},
	{
		title: 'Overtime',
		children: [
			{
				title: 'Hours',
				dataIndex: 'overtimeHours',
				align: 'center',
			},
			{
				title: 'Minutes',
				dataIndex: 'overtimeMinutes',
				align: 'center',
			},
		],
	},
];

export const TabDTRPrinting = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [isCreatingPdf, setIsCreatingPdf] = useState(false);
	const [html, setHtml] = useState('');

	// CUSTOM HOOKS
	const { params } = useQueryParams();
	const {
		data: { dtr },
		isFetching: isFetchingAttendanceLogs,
		error: attendanceLogsError,
	} = useAttendanceLogsForPrinting({
		params,
		options: { enabled: !!params?.employeeId && !!params?.timeRange },
	});

	// METHODS
	useEffect(() => {
		if (dtr.logs) {
			const data = dtr?.logs?.map((log) => ({
				key: log.id,
				day: log.day_number,
				amArrival: log.am_arrival ? formatTimeOnly(log.am_arrival) : EMPTY_CELL,
				amDeparture: log.am_departure
					? formatTimeOnly(log.am_departure)
					: EMPTY_CELL,
				pmArrival: log.pm_arrival ? formatTimeOnly(log.pm_arrival) : EMPTY_CELL,
				pmDeparture: log.pm_departure
					? formatTimeOnly(log.pm_departure)
					: EMPTY_CELL,
				overtimeHours: '',
				overtimeMinutes: '',
			}));

			setDataSource(data);
		}
	}, [dtr]);

	useEffect(() => {
		if ((!params?.employeeId || !params?.timeRange) && dataSource.length > 0) {
			setDataSource([]);
		}
	}, [params, dataSource]);

	const handleCreatePdf = () => {
		setIsCreatingPdf(true);

		let month;
		const timeRange = _.toString(params?.timeRange).split(',');
		const dateStart = dayjs(timeRange[0]);
		const dateEnd = dayjs(timeRange[1]);

		if (dateStart.month() === dateEnd.month()) {
			month = dateStart.format('MMMM');
		} else {
			month = `${dateStart.format('MMMM')} - ${dateEnd.format('MMMM')}`;
		}

		// eslint-disable-next-line new-cap
		const pdf = new jsPDF(JSPDF_SETTINGS);
		const dataHtml = printDtr({ dtr, month });

		setHtml(dataHtml);

		pdf.html(dataHtml, {
			margin: 10,
			callback: (instance) => {
				window.open(instance.output('bloburl').toString());
				setIsCreatingPdf(false);
				setHtml('');
			},
		});
	};

	return (
		<>
			<TableHeader
				buttonName="Print DTR"
				title="DTR Printing"
				wrapperClassName="px-0 pt-0"
				onCreate={handleCreatePdf}
				onCreateDisabled={dataSource.length === 0}
				onCreateIcon={<FilePdfOutlined />}
				onCreateLoading={isCreatingPdf}
			/>

			<RequestErrors
				errors={convertIntoArray(attendanceLogsError, 'Logs')}
				withSpaceBottom
			/>

			<Filter />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingAttendanceLogs}
				pagination={false}
				scroll={{ x: 800 }}
				bordered
			/>

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>
		</>
	);
};

const Filter = () => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { accounts },
		isFetching: isFetchingAccounts,
		error: accountErrors,
	} = useAccounts({
		params: { type: accountTypes.EMPLOYEE, pageSize: MAX_PAGE_SIZE },
	});

	return (
		<div className="mb-4">
			<RequestErrors
				errors={[...convertIntoArray(accountErrors, 'Users')]}
				withSpaceBottom
			/>

			<Row gutter={[16, 16]}>
				<Col md={12}>
					<Label label="Employee" spacing />
					<Select
						className="w-100"
						filterOption={filterOption}
						loading={isFetchingAccounts}
						optionFilterProp="children"
						value={params.employeeId ? Number(params.employeeId) : null}
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams({ employeeId: value }, { shouldResetPage: true });
						}}
					>
						{accounts.map((employee) => (
							<Select.Option key={employee.id} value={employee.id}>
								{getFullName(employee)}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col md={12}>
					<TimeRangeFilter
						fields={[timeRangeTypes.MONTHLY, timeRangeTypes.DATE_RANGE]}
					/>
				</Col>
			</Row>
		</div>
	);
};
