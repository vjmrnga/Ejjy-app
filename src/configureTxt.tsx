import dayjs from 'dayjs';
import { saleTypes, transactionStatus, vatTypes } from 'global';
import React from 'react';
import {
	formatDateTime,
	formatInPeso,
	getFullName,
	ReportTextFile,
} from 'utils';

const PESO_SIGN = 'P';
const EMPTY_CELL = '';
const UNDERLINE_TEXT = '---------';

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
		name = '',
		machine_identification_number: machineID = '',
		pos_terminal: posTerminal = '',
	} = branchMachine || {};
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
		pos_accreditation_date: posAccreditationDate,
		ptu_number: ptuNumber,
		ptu_date: ptuDate,
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
		text: `Acc No: ${posAccreditationNumber}`,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: `Date Issued: ${posAccreditationDate}`,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;
	rowNumber += 1;

	reportTextFile.write({
		text: `PTU No: ${ptuNumber}`,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: `Date Issued: ${ptuDate}`,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});
	rowNumber += 1;

	return rowNumber;
};

export const createXReadTxt = ({
	report,
	siteSettings,
	user,
	returnContent = false,
}) => {
	const reportTextFile = new ReportTextFile();
	let rowNumber = 0;

	rowNumber = writeHeader({
		branchMachine: report.branch_machine,
		siteSettings,
		reportTextFile,
		rowNumber,
	});
	rowNumber += 1;

	if (report.gross_sales === 0) {
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
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: 'INVOICE NUMBER',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   Beg Invoice #: ${report.beginning_or?.or_number || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   End Invoice #: ${report.ending_or?.or_number || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   Beg: ${formatInPeso(report.beginning_sales)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   Cur: ${formatInPeso(report.gross_sales)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   End: ${formatInPeso(report.ending_sales)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'TRANSACTION COUNT',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   Beg: ${report.beginning_transactions_count}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   Cur: ${report.total_transactions}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   End: ${report.ending_transactions_count}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: 'CURRENT SALES BREAKDOWN',
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
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
		text: `${formatInPeso(report.cash_sales, PESO_SIGN)} `,
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
		text: `${formatInPeso(report.credit_pay, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	if (Number(report.credit_pay) > 0) {
		reportTextFile.write({
			text: UNDERLINE_TEXT,
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
	}

	reportTextFile.write({
		text: 'GROSS SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.gross_sales, PESO_SIGN)} `,
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
		text: `${formatInPeso(report.vat_exempt, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'VATable Sales',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.vat_sales, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'VAT Amount (12%)',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.vat_amount, PESO_SIGN)} `,
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
		text: `${formatInPeso(0, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '----------------',
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
		text: `${formatInPeso(report.gross_sales, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   REG. DISCOUNT',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.regular_discount, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   SC/PWD',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.special_discount, PESO_SIGN)})`,
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
		text: `(${formatInPeso(report.void, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   VAT AMOUNT (12%)',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.vat_amount, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	if (Number(report.vat_amount) > 0) {
		reportTextFile.write({
			text: UNDERLINE_TEXT,
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
	}

	reportTextFile.write({
		text: 'NET SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.net_sales, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '----------------',
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'ADJUSTMENT ON VAT:',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   SC/PWD',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.vat_special_discount, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   OTHERS',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.others, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	if (Number(report.others) > 0) {
		reportTextFile.write({
			text: UNDERLINE_TEXT,
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
	}

	reportTextFile.write({
		text: '   TOTAL',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.total_vat_adjusted, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '----------------',
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'VAT AMOUNT (12%)',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.vat_amount, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'VAT ADJ.',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.total_vat_adjusted, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	if (Number(report.total_vat_adjusted) > 0) {
		reportTextFile.write({
			text: UNDERLINE_TEXT,
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
	}

	reportTextFile.write({
		text: 'VAT PAYABLE',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.vat_payable, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: `GDT: ${formatDateTime(report.date)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: `PDT: ${formatDateTime(dayjs(), false)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: `C: ${report?.generated_by?.employee_id || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `PB: ${user?.employee_id || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});

	rowNumber += 1;

	rowNumber += 1;

	writeFooter({
		siteSettings,
		reportTextFile,
		rowNumber,
	});

	if (returnContent) {
		return reportTextFile.get();
	}

	reportTextFile.export(`XReadReport_${report.id}.txt`);

	return <h1>Dummy</h1>;
};

export const createZReadTxt = ({
	report,
	siteSettings,
	user,
	returnContent = false,
}) => {
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
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: 'INVOICE NUMBER',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   Beg Invoice #: ${report.beginning_or?.or_number || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   End Invoice #: ${report.ending_or?.or_number || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   Beg: ${formatInPeso(report.beginning_sales)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   Cur: ${formatInPeso(report.gross_sales)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   End: ${formatInPeso(report.ending_sales)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'TRANSACTION COUNT',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   Beg: ${report.beginning_transactions_count}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   Cur: ${report.total_transactions}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: `   End: ${report.ending_transactions_count}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: 'ACCUMULATED SALES BREAKDOWN',
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
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
		text: `${formatInPeso(report.cash_sales, PESO_SIGN)} `,
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
		text: `${formatInPeso(report.credit_pay, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	if (Number(report.credit_pay) > 0) {
		reportTextFile.write({
			text: UNDERLINE_TEXT,
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
	}

	reportTextFile.write({
		text: 'GROSS SALES',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.gross_sales, PESO_SIGN)} `,
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
		text: `${formatInPeso(report.vat_exempt, PESO_SIGN)} `,
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
		text: `${formatInPeso(report.vat_sales, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'VAT Amount (12%)',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.vat_amount, PESO_SIGN)} `,
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
		text: `${formatInPeso(0, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '----------------',
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
		text: `${formatInPeso(report.gross_sales, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   REG. DISCOUNT',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.regular_discount, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   SC/PWD',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.special_discount, PESO_SIGN)})`,
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
		text: `(${formatInPeso(report.void, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   VAT AMOUNT (12%)',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.vat_amount, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	if (Number(report.vat_amount) > 0) {
		reportTextFile.write({
			text: UNDERLINE_TEXT,
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
	}

	reportTextFile.write({
		text: 'ACCUM. GRAND TOTAL',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.net_sales, PESO_SIGN)}`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '----------------',
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'ADJUSTMENT ON VAT:',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   SC/PWD',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.vat_special_discount, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '   OTHERS',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.others, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	if (Number(report.others) > 0) {
		reportTextFile.write({
			text: UNDERLINE_TEXT,
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
	}

	reportTextFile.write({
		text: '   TOTAL',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.total_vat_adjusted, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: '----------------',
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'VAT AMOUNT (12%)',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.vat_amount, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: 'VAT ADJ.',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `(${formatInPeso(report.total_vat_adjusted, PESO_SIGN)})`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	if (Number(report.total_vat_adjusted) > 0) {
		reportTextFile.write({
			text: UNDERLINE_TEXT,
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
	}

	reportTextFile.write({
		text: 'VAT PAYABLE',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `${formatInPeso(report.vat_payable, PESO_SIGN)} `,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	rowNumber += 1;

	reportTextFile.write({
		text: `GDT: ${formatDateTime(report.date)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: `PDT: ${formatDateTime(dayjs(), false)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: `C: ${report?.generated_by?.employee_id || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: `PB: ${user?.employee_id || EMPTY_CELL}`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});

	rowNumber += 1;

	rowNumber += 1;

	writeFooter({
		siteSettings,
		reportTextFile,
		rowNumber,
	});

	if (returnContent) {
		return reportTextFile.get();
	}

	reportTextFile.export(`ZReadReport_${report.id}.txt`);

	return <h1>Dummy</h1>;
};

export const createSalesInvoiceTxt = ({
	transaction,
	siteSettings,
	isReprint = false,
}) => {
	const change =
		Number(transaction.payment.amount_tendered) - transaction.total_amount;

	const previousTransactionOrNumber =
		transaction?.adjustment_remarks?.previous_voided_transaction?.invoice
			?.or_number;
	const newTransactionOrNumber =
		transaction?.adjustment_remarks?.new_updated_transaction?.invoice
			?.or_number;

	// Set discount option additional fields
	let discountOptionFields = null;
	if (transaction.discount_option_additional_fields_values?.length > 0) {
		discountOptionFields = JSON.parse(
			transaction.discount_option_additional_fields_values,
		);
	}

	// Set client name
	let title = '';
	if (transaction.payment.mode === saleTypes.CASH) {
		title = 'CASH SALES INVOICE';
	} else if (transaction.payment.mode === saleTypes.CREDIT) {
		title = 'CHARGE SALES INVOICE';
	}

	// Set client fields
	let fields = [];
	if (discountOptionFields) {
		fields = Object.keys(discountOptionFields).map((key) => ({
			key,
			value: discountOptionFields[key],
		}));
	} else if (
		transaction.client?.name ||
		transaction.payment?.creditor_account
	) {
		fields = [
			{
				key: 'NAME',
				value:
					transaction.client?.name ||
					getFullName(transaction.payment?.creditor_account) ||
					'',
			},
			{
				key: 'TIN',
				value:
					transaction.client?.tin ||
					transaction.payment?.creditor_account?.tin ||
					'',
			},
			{
				key: 'ADDRESS',
				value:
					transaction.client?.address ||
					transaction.payment?.creditor_account?.home_address ||
					'',
			},
		];
	}

	const reportTextFile = new ReportTextFile();
	let rowNumber = 0;

	rowNumber = writeHeader({
		branchMachine: transaction?.branch_machine,
		title,
		siteSettings,
		reportTextFile,
		rowNumber,
	});

	if (isReprint) {
		reportTextFile.write({
			text: `For ${formatDateTime(dayjs(), false)}`,
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		rowNumber += 1;
	}
	rowNumber += 1;

	rowNumber += 1;
	transaction.products.forEach((item) => {
		reportTextFile.write({
			text: `${item.branch_product.product.name} - ${
				item.branch_product.product.is_vat_exempted
					? vatTypes.VAT_EMPTY
					: vatTypes.VATABLE
			}`,
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		rowNumber += 1;

		reportTextFile.write({
			text: `    ${item.original_quantity} @ ${formatInPeso(
				item.price_per_piece,
				PESO_SIGN,
			)}`,
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		reportTextFile.write({
			text: formatInPeso(
				Number(item.quantity) * Number(item.price_per_piece),
				PESO_SIGN,
			),
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
	});

	reportTextFile.write({
		text: '----------------',
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	if (transaction.discount_option) {
		reportTextFile.write({
			text: 'GROSS AMOUNT',
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		reportTextFile.write({
			text: formatInPeso(transaction.gross_amount, PESO_SIGN),
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;

		reportTextFile.write({
			text: 'ADJUSTMENT ON VAT',
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		reportTextFile.write({
			text: formatInPeso(transaction.invoice.vat_amount, PESO_SIGN),
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;

		reportTextFile.write({
			text: `DISCOUNT | ${transaction.discount_option.code}`,
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		reportTextFile.write({
			text: `(${formatInPeso(transaction.overall_discount, PESO_SIGN)})`,
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;

		reportTextFile.write({
			text: '----------------',
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
	}
	reportTextFile.write({
		text: 'TOTAL AMOUNT',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(transaction.total_amount, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	if (transaction.payment.mode === saleTypes.CASH) {
		rowNumber += 1;

		reportTextFile.write({
			text: '   AMOUNT RECEIVED',
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		reportTextFile.write({
			text: formatInPeso(transaction.payment.amount_tendered, PESO_SIGN),
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
		reportTextFile.write({
			text: '   AMOUNT DUE',
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		reportTextFile.write({
			text: formatInPeso(transaction.total_amount, PESO_SIGN),
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});
		rowNumber += 1;
		reportTextFile.write({
			text: '   CHANGE',
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		reportTextFile.write({
			text: formatInPeso(change, PESO_SIGN),
			alignment: ReportTextFile.ALIGNMENTS.RIGHT,
			rowNumber,
		});

		rowNumber += 1;
	}

	rowNumber += 1;

	reportTextFile.write({
		text: 'VAT Exempt',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(transaction.invoice.vat_exempt, PESO_SIGN),
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
		text: formatInPeso(transaction.invoice.vat_sales, PESO_SIGN),
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;
	reportTextFile.write({
		text: 'VAT Amount (12%)',
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	reportTextFile.write({
		text: formatInPeso(transaction.invoice.vat_amount, PESO_SIGN),
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
		text: `GDT: ${formatDateTime(transaction.invoice.datetime_created)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: `PDT: ${formatDateTime(dayjs(), false)}`,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: transaction.invoice.or_number,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});

	reportTextFile.write({
		text: `${transaction.products.length} item(s)`,
		alignment: ReportTextFile.ALIGNMENTS.RIGHT,
		rowNumber,
	});
	rowNumber += 1;

	reportTextFile.write({
		text: transaction.teller.employee_id,
		alignment: ReportTextFile.ALIGNMENTS.LEFT,
		rowNumber,
	});
	rowNumber += 1;

	if (previousTransactionOrNumber) {
		reportTextFile.write({
			text: `Prev Invoice #: ${previousTransactionOrNumber}`,
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		rowNumber += 1;
	}

	if (newTransactionOrNumber) {
		reportTextFile.write({
			text: `New Invoice #: ${newTransactionOrNumber}`,
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		rowNumber += 1;
	}

	fields.forEach(({ key, value }) => {
		reportTextFile.write({
			text: `${key}: ${value}`,
			alignment: ReportTextFile.ALIGNMENTS.LEFT,
			rowNumber,
		});
		rowNumber += 1;
	});

	rowNumber += 1;

	rowNumber = writeFooter({
		siteSettings,
		reportTextFile,
		rowNumber,
	});

	if (isReprint && transaction.status === transactionStatus.FULLY_PAID) {
		rowNumber += 1;
		reportTextFile.write({
			text: 'REPRINT ONLY',
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
	}

	if (
		[transactionStatus.VOID_EDITED, transactionStatus.VOID_CANCELLED].includes(
			transaction.status,
		)
	) {
		rowNumber += 2;

		reportTextFile.write({
			text: 'VOIDED TRANSACTION',
			alignment: ReportTextFile.ALIGNMENTS.CENTER,
			rowNumber,
		});
	}

	rowNumber += 1;
	reportTextFile.write({
		text: siteSettings?.invoice_last_message,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});

	rowNumber += 1;
	reportTextFile.write({
		text: siteSettings?.thank_you_message,
		alignment: ReportTextFile.ALIGNMENTS.CENTER,
		rowNumber,
	});

	reportTextFile.export(`Sales_Invoice_${transaction.invoice.or_number}.txt`);

	return <h1>Dummy</h1>;
};
