/* eslint-disable */
import { message } from 'antd';
import dayjs from 'dayjs';
import qz from 'qz-tray';
import {
	orderOfPaymentPurposes,
	quantityTypes,
	vatTypes,
} from './global/types';
import {
	calculateCashBreakdownTotal,
	formatDate,
	formatDateTime,
	formatDateTime24Hour,
	formatInPeso,
	formatQuantity,
	getCashBreakdownTypeDescription,
	getFullName,
	getOrderSlipStatusBranchManagerText,
	getTransactionStatusDescription,
} from 'utils';

const PESO_SIGN = 'P';
const EMPTY_CELL = '';
const PAPER_MARGIN = 0.2; // inches
const PAPER_WIDTH = 3; // inches
const QZ_MESSAGE_KEY = 'QZ_MESSAGE_KEY';
const PRINT_MESSAGE_KEY = 'PRINT_MESSAGE_KEY';
const PRINTER_NAME = 'EPSON TM-U220 Receipt';
// const PRINTER_NAME = 'Microsoft Print to PDF';

const configurePrinter = (callback = null) => {
	if (!qz.websocket.isActive()) {
		// Authentication setup
		qz.security.setCertificatePromise(function (resolve, reject) {
			resolve(
				'-----BEGIN CERTIFICATE-----\n' +
					'MIID0TCCArmgAwIBAgIUaDAsSKn5X23jaK5xvesh/G+dG9YwDQYJKoZIhvcNAQEL\n' +
					'BQAwdzELMAkGA1UEBhMCUEgxDTALBgNVBAgMBENlYnUxDTALBgNVBAcMBENlYnUx\n' +
					'DTALBgNVBAoMBEVKSlkxDTALBgNVBAsMBEVKSlkxDTALBgNVBAMMBEVKSlkxHTAb\n' +
					'BgkqhkiG9w0BCQEWDmVqanlAZ21haWwuY29tMCAXDTIxMDMxODExNTYwMFoYDzIw\n' +
					'NTIwOTEwMTE1NjAwWjB3MQswCQYDVQQGEwJQSDENMAsGA1UECAwEQ2VidTENMAsG\n' +
					'A1UEBwwEQ2VidTENMAsGA1UECgwERUpKWTENMAsGA1UECwwERUpKWTENMAsGA1UE\n' +
					'AwwERUpKWTEdMBsGCSqGSIb3DQEJARYOZWpqeUBnbWFpbC5jb20wggEiMA0GCSqG\n' +
					'SIb3DQEBAQUAA4IBDwAwggEKAoIBAQDl8JPChLBfKjHaKqw1rWxQKR/31aXikR+Z\n' +
					'CUkVOhP+N9BqMLskizWAnFIIq5iTI0ErYO6D2d+Rrn+SYpbNPiNCp1+WkmZwDl3o\n' +
					'RHIEL01Qul21eQFFss0HVD6Bed/ABWkQuxRZlo2NFVMS9sD0nFzWlGjk6DkFvgEi\n' +
					'kwgsTKzuF3FusCpajTFm0dR2V7B4OGTdlnOv8fq57pRAxJ1kdK5h53trtrve+HrA\n' +
					'dAgJj2QdhtJRkg7UvqEroR7NBjgb0T4rkgfPKDvtRl1t+sSePu9a41zxFQ7PXSjx\n' +
					'cTUPBu+emgLwhCI+f7ijX4O4xd9UFM7m5RDU7Rxzp74jlfezw3I/AgMBAAGjUzBR\n' +
					'MB0GA1UdDgQWBBQfsMynx4euCPD6No5re42teW/BezAfBgNVHSMEGDAWgBQfsMyn\n' +
					'x4euCPD6No5re42teW/BezAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUA\n' +
					'A4IBAQBI1lCyFxWaeDUZcJJ49fbg0xzxGKzzsm99ur02e68tfwhK3uYSOhjLyzXJ\n' +
					'V0Z/4h5oGKlwNHRS+dZkJCLQ6PM8iekFBhfj6bfiT6Q6aVytiaiyHicATLuFn0Xd\n' +
					'LX8yJsqxnWoMvV4ne6jq+xROyY4QTKT/9Fn+dbzmrejvgBJ4dAHStdQlB+BRwa05\n' +
					'/ay8LPTA9eh4uxwaW5W7rHyVXjliBa+TxNlQ+60z84BFqc2zO1/guBPbI+Y1nqs5\n' +
					'rwwajZypAALkDgSCW7L837upVVZn4pH+eQkzVpb6EuftXs3CJv89cJiBux2wVDFD\n' +
					'JwviDu5h2Z88yECPLNy9qRTDcHoa\n' +
					'-----END CERTIFICATE-----',
			);
		});

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		var privateKey =
			'-----BEGIN PRIVATE KEY-----\n' +
			'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDl8JPChLBfKjHa\n' +
			'Kqw1rWxQKR/31aXikR+ZCUkVOhP+N9BqMLskizWAnFIIq5iTI0ErYO6D2d+Rrn+S\n' +
			'YpbNPiNCp1+WkmZwDl3oRHIEL01Qul21eQFFss0HVD6Bed/ABWkQuxRZlo2NFVMS\n' +
			'9sD0nFzWlGjk6DkFvgEikwgsTKzuF3FusCpajTFm0dR2V7B4OGTdlnOv8fq57pRA\n' +
			'xJ1kdK5h53trtrve+HrAdAgJj2QdhtJRkg7UvqEroR7NBjgb0T4rkgfPKDvtRl1t\n' +
			'+sSePu9a41zxFQ7PXSjxcTUPBu+emgLwhCI+f7ijX4O4xd9UFM7m5RDU7Rxzp74j\n' +
			'lfezw3I/AgMBAAECggEBAMQysuGXNqb86eyt3KMwhusfLBfcRN891ShPs/xYwhZ4\n' +
			'qWzyh7x2zAAhYh3jzRw/SKwq2VnH3ewAaPoPBX27N3r4NafU43NZzucQ//hyJBZt\n' +
			'7ueZiGxgVHGcgHkZ9MFz3GJaPtLyk3V+bJQR2DLf+JdfquEnBQDRT0ahDqg+BJBh\n' +
			'8kCwJ5G4LMoD04x2n4OF9F5iCueVjOVQFEZMiffYiHBRDGLqOeDZNgX94ZnM7Yrt\n' +
			'Nl8RR0V1VCGM4L4Rx1Csc+x38+E2inwb4A/SvtIIZthd9nNIHkg9X5eayq2BL4a2\n' +
			'gzRtPbPRG4XYAwlXzbVNm8NPxBO2fgcfJekjoU2LeAECgYEA+cGT1I/MXLmpN55o\n' +
			'VNGTLs7hM+OrXqcJOnC+zNlpLZ2YixSqCcASE8SfdrRN02jg874dFdKInzsgSBl0\n' +
			'RVNE8M030tLS9K8ZiWdOECxK4AFx7CkYDuKXIm6xlZbf5oNPKPDCUggPzbNfOr/W\n' +
			'pdGz3yr4cHAUeBq4fpuVyFb0e/8CgYEA67AtEi0NdFiOElTGgRtzOGGrBnluSg9k\n' +
			'1LFUCq58OsZjnBZXfwQ5SXf3i5Wlu/V++BVKKsk9b1b4zr2X7hWWUOq2pMrqpk5V\n' +
			'bMRMrwDAvv5NHX48DwMiSAthfUxL0cTCa1hib3Km7ftpWsPtSbXR4RSTAtKYit5C\n' +
			'CAuCccrqCcECgYEAxPmVxLPwgkTvH21wbUyoXudMl6b8Vfc5AP1AjcD+AbrkPvR6\n' +
			'Mpxn5W1SMsV7B7wUhkevGrHjjGmOSS7CE5bbrWq8lyostEuQwVxXJcw49ThOh+nV\n' +
			'DpBIkCBrMEZAqcVv3iMbrqSrChlohqYb/MVJrj1umQbcLektDrVYSRvDUDMCgYEA\n' +
			'tDoFTSfcaQKqqYPgQ6v9ALlW8d17o/B/l1F+xahF4SAB3cML51oQgIjXaAroMIH7\n' +
			'NLP7Ahre+rwUCOvcOTiSuI+zWPK+Wqv+EO1PAmfd/G80AwCb5pLr7RGe3BSyydbf\n' +
			'IPz2UOjok4U0PC8kzb/WnXqBLKBj+5UYA1ThzChxrUECgYBHNWU+U73eI0t3eshF\n' +
			'LRG73tlIcSHWVHOIQj7a4Eah+oHfWBAOXz8SrcPyCJOzPQuIn12y7fHMaBuBVdu2\n' +
			'GVIghp5ztgXYWakpAxR1N1RFx04zFaAiBKFUesQYV8QpN+EkSOFORGnkPBIEJ4GS\n' +
			'XxwqM7+VsuQCNx2WcHmO4bDN2A==\n' +
			'-----END PRIVATE KEY-----';

		qz.security.setSignatureAlgorithm('SHA512'); // Since 2.1
		qz.security.setSignaturePromise(function (toSign) {
			return function (resolve, reject) {
				try {
					var pk = eval('KEYUTIL.getKey(privateKey);');
					var sig = eval(
						'new KJUR.crypto.Signature({"alg": "SHA512withRSA"});',
					);
					sig.init(pk);
					sig.updateString(toSign);
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					var hex = sig.sign();
					resolve(eval('stob64(hextorstr(hex))'));
				} catch (err) {
					console.error(err);
					reject(err);
				}
			};
		});

		message.loading({
			content: 'Connecting to printer...',
			key: QZ_MESSAGE_KEY,
			duration: 30_000,
		});

		qz.websocket
			.connect()
			.then(() => {
				message.success({
					content: 'Successfully connected to printer.',
					key: QZ_MESSAGE_KEY,
				});

				callback?.();
			})
			.catch((err) => {
				message.error({
					content: 'Cannot register the printer.',
					key: QZ_MESSAGE_KEY,
				});
				console.error(err);
			});
	}
};

const print = ({
	data: printData,
	loadingMessage,
	successMessage,
	errorMessage,
	onComplete = null,
}) => {
	message.loading({
		content: loadingMessage,
		key: PRINT_MESSAGE_KEY,
		duration: 0,
	});

	console.log(printData);

	qz.printers
		.find(PRINTER_NAME)
		.then((printer) => {
			message.success(`Printer found: ${printer}`);
			const config = qz.configs.create(printer, {
				margins: {
					top: 0,
					right: PAPER_MARGIN,
					bottom: 0,
					left: PAPER_MARGIN,
				},
			});

			const data = [
				{
					type: 'pixel',
					format: 'html',
					flavor: 'plain',
					options: { pageWidth: PAPER_WIDTH },
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
		name,
		machine_identification_number: machineID,
		permit_to_use: ptuNumber,
		pos_terminal: posTerminal,
	} = branchMachine || {};

	return `
    <div style="text-align: center; display: flex; flex-direction: column">
      <span style="white-space: pre-line">${storeName}</span>
      <span style="white-space: pre-line">${location}</span>
      <span>${contactNumber} | ${name}</span>
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
		orderOfPayment?.charge_sales_transaction?.invoice?.id || '&nbsp;';
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
				<span style="${letterStyles}">${purposeDescription}</span> per Bill/SOA No.
				<span style="${letterStyles}">${invoiceId}</span> dated
				<span style="${letterStyles}">${invoiceDate}</span>.
			</div>

			<br/>
			<br/>
			<br/>
			<br/>
			<br/>

			<div style="padding: 0 12px; width: 60%; border-top: 2px solid black; float:right; text-align: center;">
				Head of the General Manager/Authorized Official
			</div>
		</div>
	`;

	return data;
};

export const printCollectionReceipt = ({ collectionReceipt, siteSettings }) => {
	const invoice =
		collectionReceipt.order_of_payment?.charge_sales_transaction?.invoice;
	const orderOfPayment = collectionReceipt.order_of_payment;
	const payor = orderOfPayment.payor;

	let description = orderOfPayment.extra_description;
	if ((orderOfPayment.purpose = orderOfPaymentPurposes.FULL_PAYMENT)) {
		description = 'Full Payment';
	} else if (
		(orderOfPayment.purpose = orderOfPaymentPurposes.PARTIAL_PAYMENT)
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

		<br />

		<table style="width: 100%;">
			<thead>
				<tr>
					<th style="width: 175px"></th>
					<th></th>
				</tr>
			</thead>

			<tbody>
				<tr>
					<td>Name:</td>
					<td>${getFullName(payor)}</td>
				</tr>
				<tr>
					<td>Tin:</td>
					<td></td>
				</tr>
				<tr>
					<td>the sum of:</td>
					<td>${formatInPeso(collectionReceipt.amount, 'P')}</td>
				</tr>
				<tr>
					<td>Description:</td>
					<td>${description}</td>
				</tr>
				<tr>
					<td>with invoice:</td>
					<td>${invoice?.id || EMPTY_CELL}</td>
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
			<span>${formatDateTime24Hour(collectionReceipt?.datetime_created)}</span>
			<span style="text-align: right;">${
				collectionReceipt?.created_by?.employee_id
			}</span>
		</div>

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>${invoice?.or_number || EMPTY_CELL}</span>
		</div>

		<br />

		<div style="text-align: center; display: flex; flex-direction: column">
			<span>THIS RECEIPT SHALL BE VALID FOR FIVE (5) YEARS FROM THE DATE OF PERMIT TO USE.</span>
			<span>THIS DOCUMENT IS NOT VALID FOR CLAIMING INPUT TAXES.</span>
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
	const products = receivingVoucher.products;

	const data = `
	<div style="padding: 24px; width: 380px; font-size: 16px; line-height: 100%; font-family: 'Courier', monospace;">
		${getHeader({
			title: '[RECEIVING VOUCHER]',
			siteSettings,
		})}

		<br />

		<table style="width: 100%;">
			${products
				.map(
					(item) => `<tr>
						<td colspan="2">${item.product.name}</td>
					</tr>
					<tr>
						<td style="padding-left: 30px">${formatQuantity({
							unitOfMeasurement: item.product.unit_of_measurement,
							quantity: item.quantity,
						})} @ ${formatInPeso(item.cost_per_piece, PESO_SIGN)}</td>
						<td style="text-align: right">
							${formatInPeso(
								Number(item.quantity) * Number(item.cost_per_piece),
								PESO_SIGN,
							)} ${
						item.product.is_vat_exempted ? vatTypes.VAT_EMPTY : vatTypes.VATABLE
					}
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
			<span style="text-align: right;">[ref # / trans#]</span>
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
	const products = backOrder.products;
	let totalAmount = 0;

	const data = `
	<div style="padding: 24px; width: 380px; font-size: 16px; line-height: 100%; font-family: 'Courier', monospace;">
		${getHeader({
			title: '[BO SLIP]',
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
						<td colspan="2">${item.product.name}</td>
					</tr>
					<tr>
						<td style="padding-left: 30px">${formatQuantity({
							unitOfMeasurement: item.product.unit_of_measurement,
							quantity: item.quantity_returned,
						})} @ ${formatInPeso(item.current_price_per_piece, PESO_SIGN)}</td>
						<td style="text-align: right">
							${formatInPeso(subtotal, PESO_SIGN)} ${
						item.product.is_vat_exempted ? vatTypes.VAT_EMPTY : vatTypes.VATABLE
					}
						</td>
					</tr>`;
				})
				.join('')}
		</table>

		<div style="width: 100%; text-align: right">----------------</div>

		<table style="width: 100%;">
			<tr>
				<td>TOTAL AMOUNT PAID</td>
				<td style="text-align: right; font-weight: bold;">
					${formatInPeso(totalAmount, PESO_SIGN)}
				</td>
			</tr>
		</table>

		<br />

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>${formatDateTime(backOrder.datetime_created)}</span>
			<span style="text-align: right;">[ref # / trans#]</span>
		</div>
		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>C: ${EMPTY_CELL}</span>
			<span style="text-align: right;">E: ${EMPTY_CELL}</span>
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
			<span style="text-align: right;">AS OF ${dayjs().format('MM/DD/YYYY')}</span>
		</div>

		<br />

    <table style="width: 100%;">
      <tr>
        <td>CASH SALES</td>
        <td style="text-align: right">${formatInPeso(
					report.cash_sales,
					PESO_SIGN,
				)}</td>
      </tr>
      <tr>
        <td>CREDIT SALES</td>
        <td style="text-align: right">${formatInPeso(
					report.credit_pay,
					PESO_SIGN,
				)}</td>
      </tr>
      <tr>
        <td>GROSS SALES</td>
        <td style="text-align: right">${formatInPeso(
					Number(report.cash_sales) + Number(report.credit_pay),
					PESO_SIGN,
				)}</td>
      </tr>
      <tr>
        <td style="padding-left: 30px">DISCOUNTS</td>
        <td style="text-align: right">(${formatInPeso(
					report.discount,
					PESO_SIGN,
				)})</td>
      </tr>
      <tr>
        <td style="padding-left: 30px">VOIDED SALES</td>
        <td style="text-align: right">(${formatInPeso(
					report.sales_return,
					PESO_SIGN,
				)})</td>
      </tr>
      <tr>
        <td><b>NET SALES</b></td>
        <td style="text-align: right;"><b>${formatInPeso(
					report.net_sales,
					PESO_SIGN,
				)}</b></td>
      </tr>
    </table>

		<br />

		<table style="width: 100%;">
			<tr>
				<td>VAT Exempt</td>
				<td style="text-align: right">${formatInPeso(
					report?.vat_exempt,
					PESO_SIGN,
				)}</td>
			</tr>
			<tr>
				<td>VAT Sales</td>
				<td style="text-align: right">${formatInPeso(report?.vat_sales, PESO_SIGN)}</td>
			</tr>
			<tr>
				<td>VAT Amount</td>
				<td style="text-align: right">${formatInPeso(
					report?.vat_12_percent,
					PESO_SIGN,
				)}</td>
			</tr>
      <tr>
				<td>ZERO Rated</td>
				<td style="text-align: right">${formatInPeso(0, PESO_SIGN)}</td>
			</tr>
		</table>

		<br />

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>${report?.branch_machine?.name || 'MN'} </span>
			<span style="text-align: center;">${dayjs().format('MM/DD/YYYY h:mmA')}</span>
			<span style="text-align: right;">${report?.total_transactions} tran(s)</span>
		</div>

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>C: ${
				report?.cashiering_session
					? report.cashiering_session.user.employee_id
					: ''
			}</span>
			<span>PB: ${report?.generated_by?.employee_id}</span>
		</div>

		<br />

		<div style="text-align: center;">Beg Invoice #: ${
			report?.beginning_or?.or_number || EMPTY_CELL
		}</div>
		<div style="text-align: center;">End Invoice #: ${
			report?.ending_or?.or_number || EMPTY_CELL
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
					<span>${formatInPeso(report?.beginning_sales, '')}</span>
				</div>
				<div style="display: flex; align-items: center; justify-content: space-between">
					<span>P </span>
					<span>${formatInPeso(report?.total_sales, '')}</span>
				</div>
				<div style="display: flex; align-items: center; justify-content: space-between">
					<span>P </span>
					<span>${formatInPeso(report?.ending_sales, '')}</span>
				</div>
			</div>
			<div style="flex: 1;"></div>
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

		<table style="width: 100%">
			<tr>
				<td>CASH SALES</td>
				<td style="text-align: right">${formatInPeso(
					report?.cash_sales,
					PESO_SIGN,
				)}</td>
			</tr>
			<tr>
				<td>CREDIT SALES</td>
				<td style="text-align: right">${formatInPeso(
					report?.credit_pay,
					PESO_SIGN,
				)}</td>
			</tr>
			<tr>
				<td>GROSS SALES</td>
				<td style="text-align: right">${formatInPeso(
					Number(report?.cash_sales) + Number(report?.credit_pay),
					PESO_SIGN,
				)}</td>
			</tr>
			<tr>
				<td style="padding-left: 30px">DISCOUNTS</td>
				<td style="text-align: right">(${formatInPeso(
					report?.discount,
					PESO_SIGN,
				)})</td>
			</tr>
			<tr>
				<td style="padding-left: 30px">VOIDED SALES</td>
				<td style="text-align: right">(${formatInPeso(
					report?.sales_return,
					PESO_SIGN,
				)})</td>
			</tr>
			<tr>
				<td><b>NET SALES</b></td>
				<td style="text-align: right"><b>${formatInPeso(
					report?.net_sales,
					PESO_SIGN,
				)}</b></td>
			</tr>
		</table>

		<br />

		<table style="width: 100%;">
			<tr>
				<td>VAT Exempt</td>
				<td style="text-align: right">${formatInPeso(
					report?.vat_exempt,
					PESO_SIGN,
				)}</td>
			</tr>
			<tr>
				<td>VAT Sales</td>
				<td style="text-align: right">${formatInPeso(report?.vat_sales, PESO_SIGN)}</td>
			</tr>
			<tr>
				<td>VAT Amount</td>
				<td style="text-align: right">${formatInPeso(
					report?.vat_12_percent,
					PESO_SIGN,
				)}</td>
			</tr>
      <tr>
				<td>ZERO Rated</td>
				<td style="text-align: right">${formatInPeso(0, PESO_SIGN)}</td>
			</tr>
		</table>

		<br />

		<div style="display: flex; align-items: center; justify-content: space-between">
			<span>${report?.branch_machine?.name}</span>
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
