/* eslint-disable */
import { message } from 'antd';
import dayjs from 'dayjs';
import {
	cashBreakdownCategories,
	orderOfPaymentPurposes,
	quantityTypes,
	taxTypes,
	vatTypes,
} from 'global';
import qz from 'qz-tray';
import { useUserInterfaceStore } from 'stores';
import {
	calculateCashBreakdownTotal,
	formatDate,
	formatDateTime,
	formatInPeso,
	formatQuantity,
	getAppPrinterName,
	getCashBreakdownTypeDescription,
	getFullName,
	getOrderSlipStatusBranchManagerText,
	getTransactionStatusDescription,
} from 'utils';
import authenticateQZTray from 'utils/qztray';

const PESO_SIGN = 'P';
const EMPTY_CELL = '';
const PAPER_MARGIN_INCHES = 0.2;
const PAPER_WIDTH_INCHES = 3;
const QZ_MESSAGE_KEY = 'QZ_MESSAGE_KEY';
const PRINT_MESSAGE_KEY = 'PRINT_MESSAGE_KEY';

const configurePrinter = () => {
	authenticateQZTray(qz);

	message.loading({
		content: 'Connecting to QZTray...',
		key: QZ_MESSAGE_KEY,
		duration: 5_000,
	});

	qz.websocket
		.connect()
		.then(() => {
			message.success({
				content: 'Successfully connected to QZTray.',
				key: QZ_MESSAGE_KEY,
			});
		})
		.catch((err) => {
			message.error({
				content: 'Cannot connect to QZTray.',
				key: QZ_MESSAGE_KEY,
			});
			console.error(err);
		});
};

const print = ({
	data: printData,
	loadingMessage,
	successMessage,
	errorMessage,
	onComplete = null,
}) => {
	console.log(printData);

	if (qz.websocket.isActive()) {
		message.loading({
			content: loadingMessage,
			key: PRINT_MESSAGE_KEY,
			duration: 5_000,
		});

		const { isPrinterConnected } =
			useUserInterfaceStore.getState().userInterface;

		if (isPrinterConnected) {
			qz.printers
				.find(getAppPrinterName())
				.then((printer) => {
					const config = qz.configs.create(printer, {
						margins: {
							top: 0,
							right: PAPER_MARGIN_INCHES,
							bottom: 0,
							left: PAPER_MARGIN_INCHES,
						},
					});

					const data = [
						{
							type: 'pixel',
							format: 'html',
							flavor: 'plain',
							options: { pageWidth: PAPER_WIDTH_INCHES },
							data: printData,
						},
					];

					return qz.print(config, data);
				})
				.then(() => {
					message.success({
						content: successMessage,
						key: PRINT_MESSAGE_KEY,
					});
				})
				.catch((err) => {
					message.error({
						content: errorMessage,
						key: PRINT_MESSAGE_KEY,
					});
					console.error(err);
				})
				.finally(() => {
					if (onComplete) {
						onComplete();
					}
				});
		} else {
			message.error({
				key: PRINT_MESSAGE_KEY,
				content:
					'Printer is not detected. Please check the printer connection first and try printing again.',
			});
		}
	} else {
		message.error({
			content: 'Printer is not connected or QZTray is not open.',
		});
	}
};

const getHeader = (headerData) => {
	const { branchMachine, siteSettings, title } = headerData;
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
		permit_to_use: ptuNumber = '',
		pos_terminal: posTerminal = '',
	} = branchMachine || {};

	return `
    <div style="text-align: center; display: flex; flex-direction: column">
      <span style="white-space: pre-line">${storeName}</span>
      <span style="white-space: pre-line">${location}</span>
      <span>${contactNumber} ${name ? '| ' + name : ''}</span>
      <span>${proprietor}</span>
      <span>${taxType} | ${tin}</span>
      <span>${machineID}</span>
      <span>${ptuNumber}</span>
      <span>${posTerminal}</span>
      ${title ? '</br>' : ''}
      ${title ? `<span>[${title}]</span>` : ''}
    </div>
  `;
};

const getFooter = (footerData) => {
	const {
		software_developer: softwareDeveloper,
		software_developer_address: softwareDeveloperAddress,
		software_developer_tin: softwareDeveloperTin,
		pos_accreditation_number: posAccreditationNumber,
		pos_accreditation_valid_until_date: posAccreditationValidUntilDate,
	} = footerData;

	return `
		<div style="text-align: center; display: flex; flex-direction: column">
			<span>${softwareDeveloper}</span>
			<span style="white-space: pre-line">${softwareDeveloperAddress}</span>
			<span>${softwareDeveloperTin}</span>
			<span>${posAccreditationNumber}</span>
			<span>${posAccreditationValidUntilDate}</span>
			<br />
		</div>`;
};

export const printOrderSlip = (user, orderSlip, products, quantityType) => {
	const data = `
		<div style="width: 430pt; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 7pt; line-height: 100%">
			<div style="text-align: center;">
					<div style="font-size: 10pt;">EJ AND JY</div>
					<div>WET MARKET AND ENTERPRISES</div>
					<div>POB., CARMEN, AGUSAN DEL NORTE</div>

					<br />

					<div style="font-size: 10pt">[ORDER SLIP]</div>
			</div>

			<br />

			<table style="width: 100%;">
				<tr>
					<td>Date & Time Requested:</td>
					<td style="text-align: right">${formatDateTime(
						orderSlip?.datetime_created,
					)}</td>
				</tr>
				<tr>
					<td>Requesting Branch:</td>
					<td style="text-align: right">${
						orderSlip?.requisition_slip?.requesting_user?.branch?.name
					}</td>
				</tr>
				<tr>
					<td>Created By:</td>
					<td style="text-align: right">${
						orderSlip?.requisition_slip?.requesting_user?.first_name
					} ${orderSlip?.requisition_slip?.requesting_user?.last_name}</td>
				</tr>
				<tr>
					<td>F-RS1:</td>
					<td style="text-align: right">${orderSlip?.requisition_slip?.id}</td>
				</tr>
				<tr>
					<td>F-OS1:</td>
					<td style="text-align: right">${orderSlip.id}</td>
				</tr>
				<tr>
					<td>Status:</td>
					<td style="text-align: right">${getOrderSlipStatusBranchManagerText(
						orderSlip?.status?.value,
						null,
						orderSlip?.status?.percentage_fulfilled * 100,
						orderSlip?.delivery_receipt?.status,
					)}</td>
				</tr>
			</table>

			<br />
			<br />

			<table style="width: 100%;">
				<thead>
					<tr>
						<th style="text-align: left; font-weight: normal">NAME</th>
						<th style="text-align: center; font-weight: normal">QTY REQUESTED<br/>(${
							quantityType === quantityTypes.PIECE ? 'PCS' : 'BULK'
						})</th>
						<th style="text-align: right; font-weight: normal">QTY SERVED</th>
					</tr>
				</thead>
				<tbody>
					${products
						.map(
							(product) =>
								`
							<tr>
								<td>
									<span style="display:block">${product.name}</span>
									<small>${product.barcode || product.selling_barcode}</small>
								</td>

								<td style="text-align: center">
									${product.ordered}
								</td>

								<td style="text-align: right">
									<div style="width: 50pt; height: 12pt; border: 0.1pt solid #898989; margin-left: auto;"></div>
								</td>
							</tr>
						`,
						)
						.join('')}
				</tbody>
			</table>

			<br/>
			<br/>

			<table style="width: 100%;">
				<tr>
					<td>Date & Time Printed:</td>
					<td style="text-align: right">${dayjs().format('MM/DD/YYYY h:mmA')}</td>
				</tr>
				<tr>
					<td>Printed By:</td>
					<td style="text-align: right">${getFullName(user)}</td>
				</tr>
			</table>
		</div>
	`;

	console.log(data);

	return data;
};

export const printCancelledTransactions = ({
	amount,
	filterRange,
	filterStatus,
	siteSettings,
	transactions,
	onComplete,
}) => {
	const branchMachine = transactions?.[0]?.branch_machine;

	const data = `
	<div style="width: 100%; font-size: 16px; line-height: 100%; font-family: 'Courier', monospace">
		<style>
			td {
				padding-top: 0;
				padding-bottom: 0;
				line-height: 100%;
			}
		</style>

		${getHeader({
			branchMachine,
			siteSettings,
		})}

		<br />

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>Status:</span>
			<span style="text-align: right;">${getTransactionStatusDescription(
				filterStatus,
			)}</span>
		</div>
		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>Date Range:</span>
			<span style="text-align: right;">AS OF ${dayjs().format('MM/DD/YYYY')}</span>
		</div>
		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>Date of Printing:</span>
			<span style="text-align: right;">${filterRange}</span>
		</div>

		<br />

		<table style="width: 100%;">
			${transactions
				.map(
					(transaction) =>
						`
					<tr>
						<td>${transaction?.invoice?.or_number || EMPTY_CELL}</td>
						<td style="text-align: right">
							${formatInPeso(transaction.total_amount, 'P')}
						</td>
					</tr>`,
				)
				.join('')}
		</table>

		<div style="width: 100%; text-align: right">----------------</div>

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>TOTAL</span>
			<span>${formatInPeso(amount, 'P')}</span>
		</div>

		<br />

		${getFooter({
			softwareDeveloper: siteSettings.software_developer,
			softwareDeveloperTin: siteSettings.software_developer_tin,
			posAccreditationNumber: siteSettings.pos_accreditation_number,
			posAccreditationDate: siteSettings.pos_accreditation_date,
			posAccreditationValidUntilDate:
				siteSettings.pos_accreditation_valid_until_date,
			ptuNumber: siteSettings.ptu_number,
		})}
	</div>
	`;

	print({
		data,
		loadingMessage: 'Printing transactions...',
		successMessage: 'Successfully printed transactions.',
		errorMessage: 'Error occurred while trying to print transactions.',
		onComplete,
	});
};

export const printOrderOfPayment = (orderOfPayment) => {
	const opNo = orderOfPayment.id;
	const date = formatDate(orderOfPayment.datetime_created);
	const payor = getFullName(orderOfPayment.payor);
	const address = orderOfPayment.payor.home_address;
	const amount = formatInPeso(orderOfPayment.amount, 'P');
	const invoiceId =
		orderOfPayment?.charge_sales_transaction?.invoice?.or_number || '&nbsp;';
	const invoiceDate = orderOfPayment?.charge_sales_transaction
		? formatDateTime(
				orderOfPayment.charge_sales_transaction.invoice.datetime_created,
		  )
		: '&nbsp;';

	let purposeDescription = orderOfPayment.extra_description;
	if (orderOfPayment.purpose === orderOfPaymentPurposes.PARTIAL_PAYMENT) {
		purposeDescription = 'Partial Payment';
	} else if (orderOfPayment.purpose === orderOfPaymentPurposes.FULL_PAYMENT) {
		purposeDescription = 'Full Payment';
	}

	const letterStyles =
		'display: inline-block; min-width: 225px; padding: 0 8px; border-bottom: 2px solid black; text-align:center; font-weight: bold';

	const data = `
		<div style="padding: 24px; width: 795px; font-size: 24px; line-height: 140%; font-family: 'Courier', monospace;">
			<div><b>Entity Name: EJ & JY WET MARKET AND ENTERPRISES</b></div>
			<div style="display:flex; justify-content: space-between">
				<div>
					<b>OP No.: <span style="width: 200px; display: inline-block; border-bottom: 2px solid black; text-align:center;">${opNo}</span></b>
				</div>
				<div>
					<b>Date: <span style="width: 200px; display: inline-block; border-bottom: 2px solid black; text-align:center;">${date}</span></b>
				</div>
			</div>

			<br/>
			<br/>

			<div style="font-size: 1.5em; font-weight: bold; text-align: center">ORDER OF PAYMENT</div>

			<br/>

			<div><b>The Cashier</b></div>
			<div>Cashiering Unit</div>

			<br/>
			<br/>

			<div style="text-align: justify">&emsp;&emsp;&emsp;Please issue Collection Receipt in favor of
				<span style="${letterStyles}">${payor}</span> from
				<span style="${letterStyles}; min-width: 300px">${address}</span> in the amount of
				<span style="${letterStyles}">${amount}</span> for payment of
				<span style="${letterStyles}">${purposeDescription}</span> per Charge Invoice No.
				<span style="${letterStyles}">${invoiceId}</span> dated
				<span style="${letterStyles}">${invoiceDate}</span>.
			</div>

			<br/>
			<br/>
			<br/>
			<br/>
			<br/>

			<div style="padding: 0 12px; width: 60%; border-top: 2px solid black; float:right; text-align: center;">
				Manager/Authorized Official
			</div>
		</div>
	`;

	return data;
};

export const printCollectionReceipt = ({ collectionReceipt, siteSettings }) => {
	const invoice =
		collectionReceipt.order_of_payment?.charge_sales_transaction?.invoice;
	const orderOfPayment = collectionReceipt.order_of_payment;
	const { payor, amount } = orderOfPayment;

	let description = orderOfPayment.extra_description;
	if (orderOfPayment.purpose === orderOfPaymentPurposes.FULL_PAYMENT) {
		description = 'Full Payment';
	} else if (
		orderOfPayment.purpose === orderOfPaymentPurposes.PARTIAL_PAYMENT
	) {
		description = 'Partial Payment';
	}

	const data = `
	<div style="padding: 24px; width: 795px; font-size: 16px; line-height: 100%; font-family: 'Courier', monospace;">
	${getHeader({
		branchMachine: collectionReceipt.branch_machine,
		siteSettings,
		title: 'COLLECTION RECEIPT',
	})}

	<br />

		<div style="text-align: center">Received payment from</div>

		<table style="width: 100%;">
			<thead>
				<tr>
					<th style="width: 130px"></th>
					<th></th>
				</tr>
			</thead>

			<tbody>
				<tr>
					<td>Name:</td>
					<td>${getFullName(payor)}</td>
				</tr>
        <tr>
					<td>Address:</td>
					<td>${payor.home_address || EMPTY_CELL}</td>
				</tr>
				<tr>
					<td>Tin:</td>
					<td>${payor.tin || EMPTY_CELL}</td>
				</tr>
				<tr>
					<td>the sum of:</td>
					<td>${formatInPeso(amount, PESO_SIGN)}</td>
				</tr>
				<tr>
					<td>Description:</td>
					<td>${description}</td>
				</tr>
				<tr>
					<td>with invoice:</td>
					<td>${invoice?.or_number || EMPTY_CELL}</td>
				</tr>
			</tbody>
		</table>

		<br />

    ${
			collectionReceipt.check_number
				? `
        <div>CHECK DETAILS</div>
        <table style="width: 100%;">
          <thead>
            <tr>
              <th style="width: 130px"></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bank:</td>
              <td>${collectionReceipt.bank_name || EMPTY_CELL}</td>
            </tr>
            <tr>
              <td>Branch:</td>
              <td>${collectionReceipt.bank_branch || EMPTY_CELL}</td>
            </tr>
            <tr>
              <td>Check No:</td>
              <td>${collectionReceipt.check_number || EMPTY_CELL}</td>
            </tr>
            <tr>
              <td>Check Date:</td>
              <td>${
								collectionReceipt.check_date
									? formatDate(collectionReceipt.check_date)
									: EMPTY_CELL
							}</td>
            </tr>
          </tbody>
        </table>
        <br />
      `
				: ''
		}

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>${formatDateTime(collectionReceipt?.datetime_created)}</span>
			<span style="text-align: right;">${
				collectionReceipt?.created_by?.employee_id
			}</span>
		</div>

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>${collectionReceipt?.id || EMPTY_CELL}</span>
		</div>

		<br />

		<div style="text-align: center; display: flex; flex-direction: column">
      <span>THIS DOCUMENT IS NOT VALID FOR CLAIMING INPUT TAXES.</span>
      <span>${siteSettings?.thank_you_message || EMPTY_CELL}</span>
		</div>
	</div>
	`;

	return data;
};

export const printBirReport = ({ birReports, siteSettings }) => {
	const PESO_SIGN = 'P';
	const birReportsRow = birReports
		.map(
			(report) => `
    <tr>
      <td>${formatDate(report.date)}</td>
      <td>${report?.beginning_or?.or_number || EMPTY_CELL}</td>
      <td>${report?.ending_or?.or_number || EMPTY_CELL}</td>
      <td>${formatInPeso(
				report.grand_accumulated_sales_ending_balance,
				PESO_SIGN,
			)}</td>
      <td>${formatInPeso(
				report.grand_accumulated_sales_beginning_balance,
				PESO_SIGN,
			)}</td>
      <td>${formatInPeso(report.gross_sales_for_the_day, PESO_SIGN)}</td>
      <td>${formatInPeso(report.sales_issue_with_manual, PESO_SIGN)}</td>
      <td>${formatInPeso(report.gross_sales_from_pos, PESO_SIGN)}</td>
      <td>${formatInPeso(report.vatable_sales, PESO_SIGN)}</td>
      <td>${formatInPeso(report.vat_amount, PESO_SIGN)}</td>
      <td>${formatInPeso(report.vat_exempt_sales, PESO_SIGN)}</td>
      <td>${formatInPeso(report.zero_rated_sales, PESO_SIGN)}</td>

      <td>${formatInPeso(report.regular_discount, PESO_SIGN)}</td>
      <td>${formatInPeso(report.special_discount, PESO_SIGN)}</td>
      <td>${formatInPeso(report.returns, PESO_SIGN)}</td>
      <td>${formatInPeso(report.void, PESO_SIGN)}</td>
      <td>${formatInPeso(report.total_deductions, PESO_SIGN)}</td>

      <td>${formatInPeso(report.vat_on_special_discounts, PESO_SIGN)}</td>
      <td>${formatInPeso(report.vat_on_returns, PESO_SIGN)}</td>
      <td>${formatInPeso(report.others, PESO_SIGN)}</td>
      <td>${formatInPeso(report.total_vat_adjusted, PESO_SIGN)}</td>

      <td>${formatInPeso(report.vat_payable, PESO_SIGN)}</td>
      <td>${formatInPeso(report.net_sales, PESO_SIGN)}</td>
      <td>${formatInPeso(report.other_income, PESO_SIGN)}</td>
      <td>${formatInPeso(report.sales_overrun_or_overflow, PESO_SIGN)}</td>
      <td>${formatInPeso(report.total_net_sales, PESO_SIGN)}</td>
      <td>${report.reset_counter}</td>
      <td>${report.remarks}</td>
    </tr>
  `,
		)
		.join('');

	return `
	<html lang="en">
  <head>
    <style>
      body .bir-reports-pdf {
        font-size: 12px;
      }

      table.bir-reports,
      div.details,
      .title {
        width: 1780px;
      }

      table.bir-reports {
        border-collapse: collapse;
      }

      table.bir-reports th,
      table.bir-reports .nested-row td {
        min-width: 60px;
        line-height: 100%;
      }

      table.bir-reports th[colspan] {
        background-color: #ADB9CA;
      }

      table.bir-reports th[rowspan],
      table.bir-reports .nested-row td {
        background-color: #BDD6EE;
      }

      table.bir-reports th,
      table.bir-reports td {
        border: 1px solid black;
        text-align: center;
      }

      .title {
        text-align: center;
        font-weight: bold;
      }
    </style>
  </head>

  <body>
    <div class="bir-reports-pdf">
			<div class="details">${siteSettings.proprietor}</div>
      <div class="details">${siteSettings.store_name}</div>
      <div class="details">${siteSettings.address_of_tax_payer}</div>
      <div class="details">${siteSettings.tin} - Branch Code</div>
      <div class="details">Serial #</div>

      <br/>

      <h4 class="title">BIR SALES SUMMARY REPORT</h4>
      <table class="bir-reports">
        <tr>
          <th rowspan="2">Date</th>
          <th rowspan="2">Beginning SI/OR No.</th>
          <th rowspan="2">Ending SI/OR No. </th>
          <th rowspan="2">Grand Accum. Sales Ending Balance</th>
          <th rowspan="2">Grand Accum. Sales Beginning Balance</th>
          <th rowspan="2">Gross Sales for the Day</th>
          <th rowspan="2">Sales Issued with Manual SI/OR (per RR 16-2018)</th>
          <th rowspan="2">Gross Sales From POS</th>
          <th rowspan="2">VATable Sales</th>
          <th rowspan="2">VAT Amount</th>
          <th rowspan="2">VAT-Exempt Sales</th>
          <th rowspan="2">Zero Rated Sales</th>
          <th colspan="5">Deductions</th>
          <th colspan="4">Adjustments on VAT</th>
          <th rowspan="2">VAT Payable</th>
          <th rowspan="2">Net Sales</th>
          <th rowspan="2">Other Income</th>
          <th rowspan="2">Sales Overrun/ Overflow</th>
          <th rowspan="2">Total Net Sales</th>
          <th rowspan="2">Reset Counter</th>
          <th rowspan="2">Remarks</th>
        </tr>
        <tr class="nested-row" style="font-weight: bold">
          <td>Regular Discount</td>
          <td>Special Discount (SC/PWD)</td>
          <td>Returns</td>
          <td>Void</td>
          <td>Total Deductions</td>
          <td>VAT on Special Discounts</td>
          <td>VAT on Returns</td>
          <td>Others </td>
          <td>Total VAT Adj.</td>
        </tr>
        ${birReportsRow}
      </table>
    </div>
  </body>
  </html>
	`;
};

export const printReceivingVoucherForm = ({
	receivingVoucher,
	siteSettings,
}) => {
	/**
	 * * The following details are hidden as it is not implemented yet (per Emman):
	 * * 1. Invoice #
	 */

	const products = receivingVoucher.products;

	const data = `
	<div style="padding: 24px; width: 380px; font-size: 16px; line-height: 100%; font-family: 'Courier', monospace;">
		${getHeader({
			title: 'RECEIVING VOUCHER',
			siteSettings,
		})}

		<br />

		<table style="width: 100%;">
			${products
				.map(
					(item) => `<tr>
						<td colspan="2">${item.product.name} - ${
						item.product.is_vat_exempted ? vatTypes.VAT_EMPTY : vatTypes.VATABLE
					}</td>
					</tr>
					<tr>
						<td style="padding-left: 30px">${formatQuantity({
							unitOfMeasurement: item.product.unit_of_measurement,
							quantity: item.quantity,
						})} @ ${formatInPeso(item.cost_per_piece, PESO_SIGN)}</td>
						<td style="text-align: right">
							${formatInPeso(Number(item.quantity) * Number(item.cost_per_piece), PESO_SIGN)}
						</td>
					</tr>`,
				)
				.join('')}
		</table>

		<div style="width: 100%; text-align: right">----------------</div>

		<table style="width: 100%;">
			<tr>
				<td>TOTAL AMOUNT PAID</td>
				<td style="text-align: right; font-weight: bold;">
					${formatInPeso(receivingVoucher.amount_paid, PESO_SIGN)}
				</td>
			</tr>
		</table>

		<br />

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>${formatDateTime(receivingVoucher.datetime_created)}</span>
		</div>
		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>C: ${receivingVoucher.checked_by.employee_id}</span>
			<span style="text-align: right;">E: ${
				receivingVoucher.encoded_by.employee_id
			}</span>
		</div>
		<div>Supplier: ${receivingVoucher.supplier_name}</div>

		<br />

		${getFooter(siteSettings)}
	</div>
	`;

	return data;
};

export const printStockOutForm = ({ backOrder, siteSettings }) => {
	/**
	 * * The following details are hidden as it is not implemented yet (per Emman):
	 * * 1. Supplier
	 * * 2. Check/Authorizer
	 * * 3. Invoice #
	 */

	//    <div style="display: flex; align-items: center; justify-content: space-between">
	//    <span>${formatDateTime(backOrder.datetime_created)}</span>
	//    <span style="text-align: right;">${
	//      backOrder.transaction?.invoice?.or_number || EMPTY_CELL
	//    }</span>
	//  </div>
	//  <div style="display: flex; align-items: center; justify-content: space-between">
	//    <span>C: ${backOrder?.sender?.employee_id || EMPTY_CELL}</span>
	//    <span style="text-align: right;">E: ${
	//      backOrder?.encoded_by?.employee_id || EMPTY_CELL
	//    }</span>
	//  </div>
	//  <div>
	//    <span>Supplier: ${backOrder?.supplier_name || EMPTY_CELL}</span>
	//  </div>

	const products = backOrder.products;
	let totalAmount = 0;

	const data = `
	<div style="padding: 24px; width: 380px; font-size: 16px; line-height: 100%; font-family: 'Courier', monospace;">
		${getHeader({
			title: 'BO SLIP',
			siteSettings,
		})}

		<br />

		<table style="width: 100%;">
			${products
				.map((item) => {
					const subtotal =
						Number(item.quantity_returned) *
						Number(item.current_price_per_piece);
					totalAmount += subtotal;

					return `<tr>
						<td colspan="2">${item.product.name} - ${
						item.product.is_vat_exempted ? vatTypes.VAT_EMPTY : vatTypes.VATABLE
					}</td>
					</tr>
					<tr>
						<td style="padding-left: 30px">${formatQuantity({
							unitOfMeasurement: item.product.unit_of_measurement,
							quantity: item.quantity_returned,
						})} @ ${formatInPeso(item.current_price_per_piece, PESO_SIGN)}</td>
						<td style="text-align: right">
							${formatInPeso(subtotal, PESO_SIGN)}
						</td>
					</tr>`;
				})
				.join('')}
		</table>

		<div style="width: 100%; text-align: right">----------------</div>

		<table style="width: 100%;">
			<tr>
				<td>TOTAL AMOUNT</td>
				<td style="text-align: right; font-weight: bold;">
					${formatInPeso(totalAmount, PESO_SIGN)}
				</td>
			</tr>
		</table>

		<br />

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>${formatDateTime(backOrder.datetime_created)}</span>
			<span style="text-align: right;">${EMPTY_CELL}</span>
		</div>
		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>C: ${EMPTY_CELL}</span>
			<span style="text-align: right;">E: ${
				backOrder?.encoded_by?.employee_id || EMPTY_CELL
			}</span>
		</div>
    <div>
      <span>Supplier: ${EMPTY_CELL}</span>
    </div>

		<br />

		${getFooter(siteSettings)}
	</div>
	`;

	return data;
};

export const printXReadReport = ({ report, siteSettings, isPdf = false }) => {
	const data = `
	<div class="container" style="width: 100%; position: relative; font-size: 16px; line-height: 100%; font-family: 'Courier', monospace;">
		${getHeader({
			branchMachine: report.branch_machine,
			siteSettings,
		})}

    ${
			report?.gross_sales === 0
				? '<div style="text-align: center">NO TRANSACTION</div>'
				: ''
		}

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>X-READ</span>
			<span style="text-align: right;">For ${dayjs().format('MM/DD/YYYY')}</span>
		</div>

		<br />

		<table style="width: 100%;">
			<tr>
				<td>CASH SALES</td>
				<td style="text-align: right">${formatInPeso(
					report.cash_sales,
					PESO_SIGN,
				)}&nbsp;</td>
			</tr>
			<tr>
				<td>CREDIT SALES</td>
				<td style="text-align: right">${formatInPeso(
					report.credit_pay,
					PESO_SIGN,
				)}&nbsp;</td>
			</tr>
			<tr>
				<td>GROSS SALES</td>
				<td style="text-align: right">${formatInPeso(
					report.gross_sales,
					PESO_SIGN,
				)}&nbsp;</td>
			</tr>
		</table>

		<br />

		<table style="width: 100%;">
			<tr>
				<td>VAT Exempt</td>
				<td style="text-align: right">${formatInPeso(
					report.vat_exempt,
					PESO_SIGN,
				)}&nbsp;</td>
			</tr>
      ${
				siteSettings.tax_type === taxTypes.VAT
					? `
          <tr>
            <td>VATable Sales</td>
            <td style="text-align: right">${formatInPeso(
							report.vat_sales,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
          <tr>
            <td>VAT Amount</td>
            <td style="text-align: right">${formatInPeso(
							report.vat_amount,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
        `
					: ''
			}
      <tr>
				<td>ZERO Rated</td>
				<td style="text-align: right">${formatInPeso(0, PESO_SIGN)}&nbsp;</td>
			</tr>
		</table>

		<div style="width: 100%; text-align: right">----------------</div>

    <table style="width: 100%;">
      <tr>
        <td>GROSS SALES</td>
        <td style="text-align: right">${formatInPeso(
					report.gross_sales,
					PESO_SIGN,
				)}&nbsp;</td>
      </tr>
      <tr>
        <td style="padding-left: 15px">REG. DISCOUNT</td>
        <td style="text-align: right">(${formatInPeso(
					report.regular_discount,
					PESO_SIGN,
				)})</td>
      </tr>
      <tr>
        <td style="padding-left: 15px">SPECIAL DISCOUNT</td>
        <td style="text-align: right">(${formatInPeso(
					report.special_discount,
					PESO_SIGN,
				)})</td>
      </tr>
      <tr>
        <td style="padding-left: 15px">VOIDED SALES</td>
        <td style="text-align: right">(${formatInPeso(
					report.void,
					PESO_SIGN,
				)})</td>
      </tr>
      ${
				siteSettings.tax_type === taxTypes.VAT
					? `
          <tr>
            <td style="padding-left: 15px">VAT AMOUNT</td>
            <td style="text-align: right">(${formatInPeso(
							report.vat_amount,
							PESO_SIGN,
						)})</td>
          </tr>`
					: ''
			}
      <tr>
        <td><b>NET SALES</b></td>
        <td style="text-align: right;"><b>${formatInPeso(
					report.net_sales,
					PESO_SIGN,
				)}</b>&nbsp;</td>
      </tr>
    </table>

    ${
			siteSettings.tax_type === taxTypes.VAT
				? `
        <div style="width: 100%; text-align: right">----------------</div>

        <table style="width: 100%;">
          <tr>
            <td>ADJUSTMENT ON VAT:</td>
          </tr>
          <tr>
            <td style="padding-left: 15px">SPECIAL DISCOUNT</td>
            <td style="text-align: right">${formatInPeso(
							report.vat_special_discount,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
          <tr>
            <td style="padding-left: 15px">OTHERS</td>
            <td style="text-align: right">${formatInPeso(
							report.others,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
          <tr>
            <td style="padding-left: 15px">TOTAL</td>
            <td style="text-align: right">${formatInPeso(
							report.total_vat_adjusted,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
        </table>

        <div style="width: 100%; text-align: right">----------------</div>

        <table style="width: 100%;">
          <tr>
            <td>VAT AMOUNT</td>
            <td style="text-align: right">${formatInPeso(
							report.vat_amount,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
          <tr>
            <td>VAT ADJ.</td>
            <td style="text-align: right">(${formatInPeso(
							report.total_vat_adjusted,
							PESO_SIGN,
						)})</td>
          </tr>
          <tr>
            <td>VAT PAYABLE</td>
            <td style="text-align: right">${formatInPeso(
							report.vat_payable,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
        </table>
        `
				: ''
		}

    <br />

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span style="text-align: center;">${dayjs().format('MM/DD/YYYY h:mmA')}</span>
			<span style="text-align: right;">${report.total_transactions} tran(s)</span>
		</div>

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>${report.generated_by.employee_id}</span>
		</div>

		<br />

		<div style="text-align: center;">Beg Invoice #: ${
			report.beginning_or?.or_number || EMPTY_CELL
		}</div>
		<div style="text-align: center;">End Invoice #: ${
			report.ending_or?.or_number || EMPTY_CELL
		}</div>

		<div style="display: flex">
			<div style="flex: 1; padding-right: 20px;">
				<div>Beg Sales</div>
				<div>Cur Sales</div>
				<div>End Sales</div>
			</div>
			<div>
				<div style="display: flex; align-items: center; justify-content: space-between">
					<span>P </span>
					<span>${formatInPeso(report.beginning_sales, '')}</span>
				</div>
				<div style="display: flex; align-items: center; justify-content: space-between">
					<span>P </span>
					<span>${formatInPeso(report.net_sales, '')}</span>
				</div>
				<div style="display: flex; align-items: center; justify-content: space-between">
					<span>P </span>
					<span>${formatInPeso(report.ending_sales, '')}</span>
				</div>
			</div>
		</div>

		<br />

		${getFooter(siteSettings)}
	</div>
	`;

	if (isPdf) {
		return `
		<html lang="en">
    <head>
      <style>
        .container, .container > div, .container > table {
          width: 795px !important;
        }
      </style>
    </head>
		<body>
				${data}
    </body>
  </html>`;
	}

	print({
		data,
		loadingMessage: 'Printing xread report...',
		successMessage: 'Successfully printed xread report.',
		errorMessage: 'Error occurred while trying to print xread report.',
	});
};

export const printZReadReport = ({ report, siteSettings, isPdf = false }) => {
	const data = `
	<div
	 class="container"
		style="
			width: 100%;
			font-size: 16px;
			line-height: 100%;
			font-family: 'Courier', monospace;
		"
	>
		${getHeader({
			branchMachine: report.branch_machine,
			siteSettings,
		})}

		<div
			style="display: flex; align-items: center; justify-content: space-between"
		>
			<span>Z-READ</span>
			<span style="text-align: right">AS OF ${dayjs().format('MM/DD/YYYY')}</span>
		</div>

		<br />

		<table style="width: 100%;">
			<tr>
				<td>CASH SALES</td>
				<td style="text-align: right">${formatInPeso(
					report.cash_sales,
					PESO_SIGN,
				)}&nbsp;</td>
			</tr>
			<tr>
				<td>CREDIT SALES</td>
				<td style="text-align: right">${formatInPeso(
					report.credit_pay,
					PESO_SIGN,
				)}&nbsp;</td>
			</tr>
			<tr>
				<td>GROSS SALES</td>
				<td style="text-align: right">${formatInPeso(
					report.gross_sales,
					PESO_SIGN,
				)}&nbsp;</td>
			</tr>
		</table>

		<br />

		<table style="width: 100%;">
			<tr>
				<td>VAT Exempt</td>
				<td style="text-align: right">${formatInPeso(
					report.vat_exempt,
					PESO_SIGN,
				)}&nbsp;</td>
			</tr>
      ${
				siteSettings.tax_type === taxTypes.VAT
					? `
          <tr>
            <td>VATable Sales</td>
            <td style="text-align: right">${formatInPeso(
							report.vat_sales,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
          <tr>
            <td>VAT Amount</td>
            <td style="text-align: right">${formatInPeso(
							report.vat_amount,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
        `
					: ''
			}
      <tr>
				<td>ZERO Rated</td>
				<td style="text-align: right">${formatInPeso(0, PESO_SIGN)}&nbsp;</td>
			</tr>
		</table>

		<div style="width: 100%; text-align: right">----------------</div>

    <table style="width: 100%;">
      <tr>
        <td>GROSS SALES</td>
        <td style="text-align: right">${formatInPeso(
					report.gross_sales,
					PESO_SIGN,
				)}&nbsp;</td>
      </tr>
      <tr>
        <td style="padding-left: 15px">REG. DISCOUNT</td>
        <td style="text-align: right">(${formatInPeso(
					report.regular_discount,
					PESO_SIGN,
				)})</td>
      </tr>
      <tr>
        <td style="padding-left: 15px">SPECIAL DISCOUNT</td>
        <td style="text-align: right">(${formatInPeso(
					report.special_discount,
					PESO_SIGN,
				)})</td>
      </tr>
      <tr>
        <td style="padding-left: 15px">VOIDED SALES</td>
        <td style="text-align: right">(${formatInPeso(
					report.void,
					PESO_SIGN,
				)})</td>
      </tr>
      ${
				siteSettings.tax_type === taxTypes.VAT
					? `
          <tr>
            <td style="padding-left: 15px">VAT AMOUNT</td>
            <td style="text-align: right">(${formatInPeso(
							report.vat_amount,
							PESO_SIGN,
						)})</td>
          </tr>`
					: ''
			}
      <tr>
        <td><b>NET SALES</b></td>
        <td style="text-align: right;"><b>${formatInPeso(
					report.net_sales,
					PESO_SIGN,
				)}</b>&nbsp;</td>
      </tr>
    </table>

    ${
			siteSettings.tax_type === taxTypes.VAT
				? `
        <div style="width: 100%; text-align: right">----------------</div>

        <table style="width: 100%;">
          <tr>
            <td>ADJUSTMENT ON VAT:</td>
          </tr>
          <tr>
            <td style="padding-left: 15px">SPECIAL DISCOUNT</td>
            <td style="text-align: right">${formatInPeso(
							report.vat_special_discount,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
          <tr>
            <td style="padding-left: 15px">OTHERS</td>
            <td style="text-align: right">${formatInPeso(
							report.others,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
          <tr>
            <td style="padding-left: 15px">TOTAL</td>
            <td style="text-align: right">${formatInPeso(
							report.total_vat_adjusted,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
        </table>

        <div style="width: 100%; text-align: right">----------------</div>

        <table style="width: 100%;">
          <tr>
            <td>VAT AMOUNT</td>
            <td style="text-align: right">${formatInPeso(
							report.vat_amount,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
          <tr>
            <td>VAT ADJ.</td>
            <td style="text-align: right">(${formatInPeso(
							report.total_vat_adjusted,
							PESO_SIGN,
						)})</td>
          </tr>
          <tr>
            <td>VAT PAYABLE</td>
            <td style="text-align: right">${formatInPeso(
							report.vat_payable,
							PESO_SIGN,
						)}&nbsp;</td>
          </tr>
        </table>
        `
				: ''
		}

		<br />

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span style="text-align: right">${dayjs().format('MM/DD/YYYY h:mmA')}</span>
			<span>${report?.generated_by?.employee_id || EMPTY_CELL}</span>
		</div>

		<div style="text-align: center">
			End SI #: ${report?.ending_or?.or_number || EMPTY_CELL}
		</div>

		<br />

		${getFooter(siteSettings)}
	</div>
	`;

	if (isPdf) {
		return `
		<html lang="en">
    <head>
      <style>
        .container, .container > div, .container > table {
          width: 795px !important;
        }
      </style>
    </head>
		<body>
				${data}
    </body>
  </html>`;
	}

	print({
		data,
		loadingMessage: 'Printing zread report...',
		successMessage: 'Successfully printed zread report.',
		errorMessage: 'Error occurred while trying to print zread report.',
	});
};

export const printCashBreakdown = ({
	cashBreakdown,
	siteSettings,
	isPdf = false,
}) => {
	const branchMachine = cashBreakdown.branch_machine;
	const session = cashBreakdown.cashiering_session;

	const breakdownCoins = [
		{
			label: '0.25',
			quantity: cashBreakdown.coins_25,
			amount: formatInPeso(0.25 * cashBreakdown.coins_25, ''),
		},
		{
			label: '1.00',
			quantity: cashBreakdown.coins_1,
			amount: formatInPeso(cashBreakdown.coins_1, ''),
		},
		{
			label: '5.00',
			quantity: cashBreakdown.coins_5,
			amount: formatInPeso(5 * cashBreakdown.coins_5, ''),
		},
		{
			label: '10.00',
			quantity: cashBreakdown.coins_10,
			amount: formatInPeso(10 * cashBreakdown.coins_10, ''),
		},
		{
			label: '20.00',
			quantity: cashBreakdown.coins_20,
			amount: formatInPeso(20 * cashBreakdown.coins_20, ''),
		},
	];
	const denomCoins = breakdownCoins.map(
		({ label }) => `
				<div style="
						display: flex;
						align-items: center;
						justify-content: space-between
					">
					<span>P </span>
					<span>${label}</span>
				</div>
				`,
	);
	const quantityCoins = breakdownCoins.map(
		({ quantity }) => `<div>${quantity}</div>`,
	);
	const amountCoins = breakdownCoins.map(
		({ amount }) => `
				<div style="
						display: flex;
						align-items: center;
						justify-content: space-between
					">
					<span>P </span>
					<span>${amount}</span>
				</div>
				`,
	);
	const breakdownBills = [
		{
			label: '20.00',
			quantity: cashBreakdown.bills_20,
			amount: formatInPeso(20 * cashBreakdown.bills_20, ''),
		},
		{
			label: '50.00',
			quantity: cashBreakdown.bills_50,
			amount: formatInPeso(50 * cashBreakdown.bills_50, ''),
		},
		{
			label: '100.00',
			quantity: cashBreakdown.bills_100,
			amount: formatInPeso(100 * cashBreakdown.bills_100, ''),
		},
		{
			label: '200.00',
			quantity: cashBreakdown.bills_200,
			amount: formatInPeso(200 * cashBreakdown.bills_200, ''),
		},
		{
			label: '500.00',
			quantity: cashBreakdown.bills_500,
			amount: formatInPeso(500 * cashBreakdown.bills_500, ''),
		},
		{
			label: '1,000.00',
			quantity: cashBreakdown.bills_1000,
			amount: formatInPeso(1000 * cashBreakdown.bills_1000, ''),
		},
	];
	const denomBills = breakdownBills.map(
		({ label }) => `
				<div style="
						display: flex;
						align-items: center;
						justify-content: space-between
					">
					<span>P </span>
					<span>${label}</span>
				</div>
				`,
	);
	const quantityBills = breakdownBills.map(
		({ quantity }) => `<div>${quantity}</div>`,
	);
	const amountBills = breakdownBills.map(
		({ amount }) => `
				<div style="
						display: flex;
						align-items: center;
						justify-content: space-between
					">
					<span>P </span>
					<span>${amount}</span>
				</div>
				`,
	);

	const data = `
	<div class="container" style="width: 100%; font-size: 16px; line-height: 100%; font-family: 'Courier', monospace">
		<style>
			td {
				padding-top: 0;
				padding-bottom: 0;
				line-height: 100%;
			}
		</style>

		<div style="text-align: center; display: flex; flex-direction: column">
      <span style="white-space: pre-line">${siteSettings.store_name}</span>
      <span style="white-space: pre-line">${
				siteSettings.address_of_tax_payer
			}</span>
      <span>${branchMachine.name}</span>

			<br />

			<span>[CASH BREAKDOWN]</span>
			<span>${getCashBreakdownTypeDescription(
				cashBreakdown.category,
				cashBreakdown.type,
			)}</span>
		</div>

		<br />

		<div style="display: flex">
			<div>
				<div style="text-align: center">DENOM</div>
				<br/>
				<div>COINS</div>
				${denomCoins.join('')}
				<br/>
				<div>BILLS</div>
				${denomBills.join('')}
			</div>
			<div style="flex: 1; padding-left: 10px; display: flex; flex-direction: column; align-items: center">
				<div>QTY</div>
				<br/>
				<br/>
				${quantityCoins.join('')}
				<br/>
				<br/>
				${quantityBills.join('')}
			</div>
			<div>
				<div style="text-align: center">AMOUNT</div>
				<br/>
				<br/>
				${amountCoins.join('')}
				<br/>
				<br/>
				${amountBills.join('')}
			</div>
		</div>

		<div style="display: flex; align-items: center; justify-content: space-evenly">
			<span>TOTAL</span>
			<span>${formatInPeso(
				calculateCashBreakdownTotal(cashBreakdown),
				PESO_SIGN,
			)}</span>
		</div>

		<br />

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>${formatDateTime(dayjs())}</span>
			<span>${session?.user?.employee_id}</span>
		</div>
    ${
			cashBreakdown.category === cashBreakdownCategories.CASH_IN
				? `<div>Remarks: ${cashBreakdown.remarks}</div>`
				: ''
		}

		<br />
		<br />

    ${getFooter(siteSettings)}
	</div>
	`;

	if (isPdf) {
		return `
		<html lang="en">
    <head>
      <style>
        .container, .container > div, .container > table {
          width: 795px !important;
        }
      </style>
    </head>
		<body>
				${data}
    </body>
  </html>`;
	}

	print({
		data,
		loadingMessage: 'Printing cash breakdown...',
		successMessage: 'Successfully printed cash breakdown.',
		errorMessage: 'Error occurred while trying to print cash breakdown.',
	});
};

export const printCashOut = ({ cashOut, siteSettings, isPdf = false }) => {
	const metadata = cashOut.cash_out_metadata;

	const {
		payee,
		particulars,
		received_by: receivedBy,
		prepared_by_user: preparedByUser,
	} = metadata;
	const datetime = formatDateTime(cashOut.datetime_created);
	const amount = formatInPeso(metadata.amount, 'P');
	const preparedBy = getFullName(metadata.prepared_by_user);
	const approvedBy = getFullName(metadata.approved_by_user);
	const branchMachine = cashOut.branch_machine;

	const data = `
	<div style="width: 100%; font-size: 16px; line-height: 100%; font-family: 'Courier', monospace">
		<div style="text-align: center; display: flex; flex-direction: column">
      <span style="white-space: pre-line">${siteSettings.store_name}</span>
      <span style="white-space: pre-line">${
				siteSettings.address_of_tax_payer
			}</span>
      <span>${branchMachine.name}</span>

			<br />

			<span>[DISBURSEMENT VOUCHER]</span>
		</div>

		<br />

		<table style="width: 100%;">
			<thead>
				<tr>
					<th style="width: 130px"></th>
					<th></th>
				</tr>
			</thead>

			<tbody>
				<tr>
					<td>Payee:</td>
					<td>${payee}</td>
				</tr>
        <tr>
					<td>Particulars:</td>
					<td>${particulars}</td>
				</tr>
				<tr>
					<td>Amount:</td>
					<td>${amount}</td>
				</tr>
        <tr>
					<td>Received by:</td>
					<td>${receivedBy}</td>
				</tr>
				<tr>
					<td>Prepared by:</td>
					<td>${preparedBy}</td>
				</tr>
				<tr>
					<td>Approved by:</td>
					<td>${approvedBy}</td>
				</tr>
			</tbody>
		</table>

		<br />

    <div style="display: flex; align-items: center; justify-content: space-between">
			<span>${datetime}</span>
			<span style="text-align: right;">${preparedByUser.employee_id}</span>
		</div>

    <br />

    ${getFooter(siteSettings)}
	</div>
	`;

	if (isPdf) {
		return `
		<html lang="en">
    <head>
      <style>
        .container {
          width: 795px !important;
        }
      </style>
    </head>
		<body>
				${data}
    </body>
  </html>`;
	}

	print({
		data,
		loadingMessage: 'Printing cash out receipt...',
		successMessage: 'Successfully printed cash out receipt.',
		errorMessage: 'Error occurred while trying to print cash out receipt.',
	});
};

export default configurePrinter;
