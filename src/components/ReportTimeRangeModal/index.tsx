import { Button, Modal, message } from 'antd';
import { RequestErrors } from 'components/RequestErrors';
import { TimeRangeFilter } from 'components/TimeRangeFilter';
import {
	DESKTOP_FOLDER_OPEN_FUNCTION,
	EJOURNAL_FOLDER,
	readReportTypes,
} from 'global';
import {
	useBulkExportXReadReports,
	useBulkExportZReadReports,
	useQueryParams,
	useSiteSettings,
} from 'hooks';
import React from 'react';
import { useUserStore } from 'stores';
import { convertIntoArray } from 'utils';

let ipcRenderer;
if (window.require) {
	const electron = window.require('electron');
	ipcRenderer = electron.ipcRenderer;
}

interface Props {
	type: any;
	onClose: any;
}

export const ReportTimeRangeModal = ({ type, onClose }: Props) => {
	const { params } = useQueryParams();
	const user = useUserStore((state) => state.user);
	const {
		data: siteSettings,
		isFetching: isFetchingSiteSettings,
		error: siteSettingsError,
	} = useSiteSettings();
	const {
		mutateAsync: bulkExportXReadReports,
		isLoading: isExportingXReadReports,
		error: bulkExportXReadReportsError,
	} = useBulkExportXReadReports();
	const {
		mutateAsync: bulkExportZReadReports,
		isLoading: isExportingZreadReports,
		error: bulkExportZreadReportsError,
	} = useBulkExportZReadReports();

	const handleBulkExport = async () => {
		const paramsData = {
			siteSettings,
			timeRange: params.timeRange,
			user,
		};

		if (readReportTypes.XREAD === type) {
			await bulkExportXReadReports(paramsData);
		} else if (readReportTypes.ZREAD === type) {
			await bulkExportZReadReports(paramsData);
		}

		if (ipcRenderer) {
			await ipcRenderer.send(DESKTOP_FOLDER_OPEN_FUNCTION, EJOURNAL_FOLDER);
		}

		message.success('E-journals have been generated successfully.');
	};

	return (
		<Modal
			className="Modal__hasFooter"
			footer={
				<Button type="primary" block onClick={handleBulkExport}>
					Submit
				</Button>
			}
			title="Bulk Generate - Select Time Range"
			width={400}
			centered
			closable
			open
			onCancel={onClose}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(bulkExportXReadReportsError),
					...convertIntoArray(bulkExportZreadReportsError),
					...convertIntoArray(siteSettingsError),
				]}
				withSpaceBottom
			/>

			<TimeRangeFilter
				disabled={
					isExportingXReadReports ||
					isExportingZreadReports ||
					isFetchingSiteSettings
				}
			/>
		</Modal>
	);
};
