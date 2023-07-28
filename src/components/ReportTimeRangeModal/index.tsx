import { Button, Modal, message } from 'antd';
import { RequestErrors } from 'components/RequestErrors';
import { TimeRangeFilter } from 'components/TimeRangeFilter';
import { DESKTOP_FOLDER_OPEN_FUNCTION, EJOURNAL_FOLDER } from 'global';
import { useBulkExport, useQueryParams, useSiteSettings } from 'hooks';
import React from 'react';
import { useUserStore } from 'stores';
import { convertIntoArray } from 'utils';

let ipcRenderer;
if (window.require) {
	const electron = window.require('electron');
	ipcRenderer = electron.ipcRenderer;
}

interface Props {
	onClose: any;
}

export const ReportTimeRangeModal = ({ onClose }: Props) => {
	const { params } = useQueryParams();
	const user = useUserStore((state) => state.user);
	const {
		data: siteSettings,
		isFetching: isFetchingSiteSettings,
		error: siteSettingsError,
	} = useSiteSettings();
	const {
		mutateAsync: bulkExport,
		isLoading: isExporting,
		error: bulkExportError,
	} = useBulkExport();

	const handleBulkExport = async () => {
		await bulkExport({
			siteSettings,
			timeRange: params.timeRange,
			user,
		});

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
					...convertIntoArray(bulkExportError),
					...convertIntoArray(siteSettingsError),
				]}
				withSpaceBottom
			/>

			<TimeRangeFilter disabled={isExporting || isFetchingSiteSettings} />
		</Modal>
	);
};
