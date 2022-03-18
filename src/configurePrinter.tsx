/* eslint-disable */
import { message } from 'antd';
import dayjs from 'dayjs';
import qz from 'qz-tray';
import { orderOfPaymentPurposes, quantityTypes } from './global/types';
import {
	formatDate,
	formatDateTime,
	formatDateTime24Hour,
	formatInPeso,
	getFullName,
	getOrderSlipStatusBranchManagerText,
	getTransactionStatusDescription,
} from './utils/function';

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
			duration: 0,
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

const print = (
	printData,
	loadingMessage,
	successMessage,
	errorMessage,
	onComplete,
) => {
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
			onComplete();
		});
};

const getHeader = (headerData) => {
	const { title, proprietor, location, tin, taxType, permitNumber } =
		headerData;

	return `
		<div style="text-align: center; display: flex; flex-direction: column">
			<div style="font-size: 20px">EJ AND JY</div>
			<span>WET MARKET AND ENTERPRISES</span>
			<span>POB., CARMEN, AGUSAN DEL NORTE</span>
			<span>${proprietor || EMPTY_CELL}</span>
			<span>Tel# 808-8866</span>
			<span>${location || EMPTY_CELL}</span>
			<span>${taxType || EMPTY_CELL} ${tin || EMPTY_CELL}</span>
			<span>${permitNumber || EMPTY_CELL}</span>
			<span>${title}</span>
		</div>`;
};

const getFooter = ({
	softwareDeveloper,
	softwareDeveloperTin,
	posAccreditationNumber,
	posAccreditationDate,
	posAccreditationValidUntilDate,
	ptuNumber,
}) => `
		<div style="text-align: center; display: flex; flex-direction: column">
			<span>${softwareDeveloper}</span>
			<span>Burgos St., Poblacion, Carmen,</span>
			<span>Agusan del Norte</span>
			<span>${softwareDeveloperTin}</span>
			<span>${posAccreditationNumber || EMPTY_CELL}</span>
			<span>${posAccreditationDate || EMPTY_CELL}</span>
			<span>${posAccreditationValidUntilDate || EMPTY_CELL}</span>

			<br />

			<span>${ptuNumber || EMPTY_CELL}</span>
		</div>`;

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
									<small>${product.barcode}</small>
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
					<td style="text-align: right">${user.first_name} ${user.last_name}</td>
				</tr>
			</table>
		</div>
	`;

	console.log(data);

	return data;
};

export const printCancelledTransactions = ({
	filterStatus,
	filterRange,
	amount,
	transactions,
	siteSettings,
	onComplete,
}) => {
	const data = `
	<div style="width: 100%; font-size: 16px; line-height: 100%; font-family: 'Calibri', monospace">
		<style>
			td {
				padding-top: 0;
				padding-bottom: 0;
				line-height: 100%;
			}
		</style>

		${getHeader({
			proprietor: siteSettings.proprietor,
			location: siteSettings.location,
			tin: siteSettings.tin,
			taxType: siteSettings.taxType,
			permitNumber: siteSettings.permit_number,
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

	print(
		data,
		'Printing transactions...',
		'Successfully printed transactions.',
		'Error occurred while trying to print transactions.',
		onComplete,
	);
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
		<div style="padding: 24px; width: 795px; font-size: 24px; line-height: 140%; font-family: 'Calibri', monospace;">
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

export const printCollectionReceipt = (collectionReceipt) => {
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
	<div style="padding: 24px; width: 795px; font-size: 16px; line-height: 100%; font-family: 'Calibri', monospace;">
		${getHeader({
			title: '[COLLECTION RECEIPT]',
			proprietor: invoice?.proprietor,
			location: invoice?.location,
			tin: invoice?.tin,
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

		<div>[optional if check]</div>
		<table style="width: 100%;">
			<thead>
				<tr>
					<th style="width: 175px"></th>
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
		<br />
		<br />

		<div style="text-align: center; display: flex; flex-direction: column">
			<span>THIS RECEIPT SHALL BE VALID FOR FIVE (5) YEARS FROM THE DATE OF PERMIT TO USE.</span>
			<span>THIS DOCUMENT IS NOT VALID FOR CLAIMING INPUT TAXES.</span>
		</div>
	</div>
	`;

	return data;
};

export default configurePrinter;
