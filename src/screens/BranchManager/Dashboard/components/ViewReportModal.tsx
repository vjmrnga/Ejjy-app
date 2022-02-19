import { Divider, Modal } from 'antd';
import React from 'react';
import { DetailsRow, DetailsSingle } from '../../../../components';
import { Button } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { formatInPeso } from '../../../../utils/function';

interface Props {
	visible: boolean;
	report: any;
	onClose: any;
}

export const ViewReportModal = ({ report, visible, onClose }: Props) => (
	<Modal
		className="Modal__hasFooter"
		title="Report"
		visible={visible}
		footer={[<Button text="Close" onClick={onClose} />]}
		onCancel={onClose}
		centered
		closable
	>
		<DetailsRow>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Location"
				value={report?.location || EMPTY_CELL}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Proprietor"
				value={report?.proprietor || EMPTY_CELL}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="TIN"
				value={report?.tin || EMPTY_CELL}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Permit No."
				value={report?.permit_number || EMPTY_CELL}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Machine ID"
				value={report?.branch_machine?.machine_id || EMPTY_CELL}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Serial No (of printer)"
				value={
					report?.branch_machine?.machine_printer_serial_number || EMPTY_CELL
				}
			/>

			<Divider dashed />

			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Cash Sales"
				value={formatInPeso(report?.cash_sales)}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Check Sales"
				value={formatInPeso(report?.check_sales)}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Credit Pay"
				value={formatInPeso(report?.credit_pay)}
			/>

			<Divider dashed />

			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Sales Return"
				value={formatInPeso(report?.sales_return)}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Total Sales"
				value={formatInPeso(report?.total_sales)}
			/>

			<Divider dashed />

			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="VAT Exempt"
				value={formatInPeso(report?.vat_exempt)}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="VAT Sales"
				value={formatInPeso(report?.vat_sales)}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="12% of VAT"
				value={formatInPeso(report?.vat_12_percent)}
			/>

			<Divider dashed />

			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Cashier"
				value={`${report?.generated_by?.first_name} ${report?.generated_by?.last_name}`}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Total Transactions"
				value={report?.total_transactions}
			/>

			<Divider dashed />

			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Beginning OR #"
				value={report?.beginning_or?.or_number || EMPTY_CELL}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Ending OR # "
				value={report?.ending_or?.or_number || EMPTY_CELL}
			/>

			<Divider dashed />

			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Beginning Sales"
				value={formatInPeso(report?.beginning_sales)}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Current Sales"
				value={formatInPeso(report?.total_sales)}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Ending Sales"
				value={formatInPeso(report?.ending_sales)}
			/>

			<Divider dashed />

			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Software Developer"
				value={report?.software_developer || EMPTY_CELL}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="TIN"
				value={report?.software_developer_tin || EMPTY_CELL}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="POS Accreditation Number"
				value={report?.pos_accreditation_number || EMPTY_CELL}
			/>
			<DetailsSingle
				labelSpan={12}
				valueSpan={12}
				label="Accreditation Date"
				value={report?.pos_accreditation_date || EMPTY_CELL}
			/>
		</DetailsRow>
	</Modal>
);
