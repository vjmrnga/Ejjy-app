import dayjs from 'dayjs';
import React from 'react';
import { formatInPeso } from 'utils';
import { ReportTextFile } from 'utils/ReportTextFile';

const PESO_SIGN = 'P';
const EMPTY_CELL = '';

const writeHeader = (headerData) => {
	const {
		branchMachine,
		siteSettings,
		reportTextFile,
		rowNumber: currentRowNumber,
		title,
	} = headerData;
	const {
		contact_number: contactNumber,
		address_of_tax_payer: location,
		proprietor,
		store_name: storeName,
		tax_type: taxType,
		tin,
	} = siteSettings;
	const {
		name,
		permit_to_use: ptuNumber,
		machine_identification_number: machineID,
		pos_terminal: posTerminal,
	} = branchMachine;
	let rowNumber = currentRowNumber;

	const storeNames = storeName.trim().split('\n');
	storeNames.forEach((item) => {
		reportTextFile.write({
			text: item,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	});

	const locations = location.trim().split('\n');
	locations.forEach((item) => {
		reportTextFile.write({
			text: item,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	});

	reportTextFile.write({
		text: `${contactNumber} | ${name}`,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: proprietor,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: `${taxType} | ${tin}`,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: machineID,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: ptuNumber,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: posTerminal,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	if (title) {
		rowNumber += 1;
		reportTextFile.write({
			text: `[${title}]`,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
	}

	return rowNumber;
};

const writeFooter = (footerData) => {
	const {
		siteSettings,
		reportTextFile,
		rowNumber: currentRowNumber,
	} = footerData;
	const {
		software_developer: softwareDeveloper,
		software_developer_address: softwareDeveloperAddress,
		software_developer_tin: softwareDeveloperTin,
		pos_accreditation_number: posAccreditationNumber,
		pos_accreditation_valid_until_date: posAccreditationValidUntilDate,
	} = siteSettings;
	let rowNumber = currentRowNumber;

	reportTextFile.write({
		text: softwareDeveloper,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	const locations = softwareDeveloperAddress.trim().split('\n');
	locations.forEach((name) => {
		reportTextFile.write({
			text: name,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	});

	reportTextFile.write({
		text: softwareDeveloperTin,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: posAccreditationNumber,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: posAccreditationValidUntilDate,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	return rowNumber;
};

export const createXReadTxt = ({ report, siteSettings }) => {
	const reportTextFile = new ReportTextFile();
	let rowNumber = 0;

	rowNumber = writeHeader({
		branchMachine: report.branch_machine,
		siteSettings,
		reportTextFile,
		rowNumber,
	});
	rowNumber += 1;

	if (report?.gross_sales === 0) {
		rowNumber += 1;
		reportTextFile.write({
			text: 'NO TRANSACTION',
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
		rowNumber += 1;
	}

	reportTextFile.write({
		text: 'X-READ',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `AS OF ${dayjs().format('MM/DD/YYYY')}`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: 'CASH SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.cash_sales, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'CREDIT SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.credit_pay, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'GROSS SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(
			Number(report.cash_sales) + Number(report.credit_pay),
			PESO_SIGN,
		),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   DISCOUNTS',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.discount, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   VOIDED SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.sales_return, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'NET SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.net_sales, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: 'VAT Exempt',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.vat_exempt, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: 'VAT Sales',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.vat_sales, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: 'VAT Amount',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.vat_12_percent, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: 'ZERO Rated',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(0, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: report?.branch_machine?.name || 'MN',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: dayjs().format('MM/DD/YYYY h:mmA'),
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	reportTextFile.write({
		text: `${report?.total_transactions} tran(s)`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: `C: ${
			report?.cashiering_session
				? report.cashiering_session.user.employee_id
				: ''
		}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `PB: ${report?.generated_by?.employee_id}`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: `Beg Invoice #: ${report?.beginning_or?.or_number || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `End Invoice #: ${report?.ending_or?.or_number || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: `Beg Sales: ${formatInPeso(report?.beginning_sales, PESO_SIGN)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `Cur Sales: ${formatInPeso(report?.total_sales, PESO_SIGN)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `End Sales: ${formatInPeso(report?.ending_sales, PESO_SIGN)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	writeFooter({
		siteSettings,
		reportTextFile,
		rowNumber,
	});

	reportTextFile.export(`xread_${report.id}.txt`);

	return <h1>Dummy</h1>;
};

export const createZReadTxt = ({ report, siteSettings }) => {
	const reportTextFile = new ReportTextFile();
	let rowNumber = 0;

	rowNumber = writeHeader({
		branchMachine: report.branch_machine,
		siteSettings,
		reportTextFile,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'Z-READ',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `AS OF ${dayjs().format('MM/DD/YYYY')}`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: 'CASH SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.cash_sales, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'CREDIT SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.credit_pay, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'GROSS SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(
			Number(report.cash_sales) + Number(report.credit_pay),
			PESO_SIGN,
		),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   DISCOUNTS',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.discount, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   VOIDED SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.sales_return, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'NET SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.net_sales, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: 'VAT Exempt',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.vat_exempt, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: 'VAT Sales',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.vat_sales, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: 'VAT Amount',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(report.vat_12_percent, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: 'ZERO Rated',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(0, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: report?.branch_machine?.name || 'MN',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: dayjs().format('MM/DD/YYYY h:mmA'),
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	reportTextFile.write({
		text: `${report?.generated_by?.employee_id || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: `End OR#: ${report?.ending_or?.or_number || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	writeFooter({
		siteSettings,
		reportTextFile,
		rowNumber,
	});

	reportTextFile.export(`zread_${report.id}.txt`);

	return <h1>Dummy</h1>;
};
