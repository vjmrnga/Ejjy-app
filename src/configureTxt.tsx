import dayjs from 'dayjs';
import { saleTypes, vatTypes } from 'global';
import React from 'react';
import { formatDateTime, formatInPeso, formatQuantity } from 'utils/function';
import { ReportTextFile } from 'utils/ReportTextFile';

const PESO_SIGN = 'P';
const EMPTY_CELL = '';

const writeHeader = (headerData) => {
	const {
		title,
		proprietor,
		location,
		tin,
		taxType,
		machineId,
		machinePrinterSerialNumber,
		reportTextFile,
		rowNumber: currentRowNumber,
	} = headerData;
	let rowNumber = currentRowNumber;

	reportTextFile.write({
		text: 'EJ AND JY',
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'WET MARKET AND ENTERPRISES',
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'POB., CARMEN, AGUSAN DEL NORTE',
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'Tel# 808-8866',
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	if (proprietor) {
		reportTextFile.write({
			text: proprietor,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	}

	if (location) {
		reportTextFile.write({
			text: location,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	}

	if (tin) {
		reportTextFile.write({
			text: `${taxType} | ${tin}`,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	}

	if (machineId) {
		reportTextFile.write({
			text: machineId,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	}

	if (machinePrinterSerialNumber) {
		reportTextFile.write({
			text: machinePrinterSerialNumber,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	}

	if (title) {
		reportTextFile.write({
			text: `[${title}]`,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
	}

	return rowNumber;
};

const writeFooter = (headerData) => {
	const {
		siteSettings,
		reportTextFile,
		rowNumber: currentRowNumber,
	} = headerData;
	const {
		software_developer,
		software_developer_tin,
		pos_accreditation_number,
		pos_accreditation_date,
		pos_accreditation_valid_until_date,
	} = siteSettings;
	let rowNumber = currentRowNumber;

	if (software_developer) {
		reportTextFile.write({
			text: software_developer,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	}

	reportTextFile.write({
		text: 'Burgos St., Poblacion, Carmen',
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'Agusan del Norte',
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	if (software_developer_tin) {
		reportTextFile.write({
			text: software_developer_tin,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	}

	if (pos_accreditation_number) {
		reportTextFile.write({
			text: pos_accreditation_number,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	}

	if (pos_accreditation_date) {
		reportTextFile.write({
			text: pos_accreditation_date,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	}

	if (pos_accreditation_valid_until_date) {
		reportTextFile.write({
			text: pos_accreditation_valid_until_date,
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
		rowNumber += 1;
	}

	return rowNumber;
};

export const createXReadTxt = ({ report, siteSettings }) => {
	const reportTextFile = new ReportTextFile();
	let rowNumber = 0;

	rowNumber = writeHeader({
		proprietor: report?.proprietor,
		location: report?.location,
		tin: report?.tin,
		taxType: siteSettings.tax_type,
		permitNumber: siteSettings.permit_number,
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
		proprietor: report?.proprietor,
		location: report?.location,
		tin: report?.tin,
		taxType: siteSettings.tax_type,
		permitNumber: siteSettings.permit_number,
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
