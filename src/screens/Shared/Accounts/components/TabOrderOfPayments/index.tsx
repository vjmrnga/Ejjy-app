import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select, Spin, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	RequestErrors,
	TableHeader,
	TimeRangeFilter,
	ViewTransactionModal,
} from 'components';
import { Label } from 'components/elements';
import { printOrderOfPayment } from 'configurePrinter';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	JSPDF_SETTINGS,
	orderOfPaymentPurposes,
	pageSizeOptions,
	SEARCH_DEBOUNCE_TIME,
	timeRangeTypes,
} from 'global';
import { useAccounts, useOrderOfPayments, useQueryParams } from 'hooks';
import { jsPDF } from 'jspdf';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDateTime,
	formatInPeso,
	getFullName,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'OP #', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime' },
	{ title: 'Payor', dataIndex: 'payor' },
	{ title: 'Address', dataIndex: 'address' },
	{ title: 'Amount of Payment', dataIndex: 'amountOfPayment' },
	{ title: 'Purpose', dataIndex: 'purpose' },
	{ title: 'Charge Sales Invoice', dataIndex: 'chargeSalesInvoice' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabOrderOfPayments = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	// NOTE: Will store the ID of the order of payment that is about to be printed.
	const [isPrinting, setIsPrinting] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { orderOfPayments, total },
		isFetching: isFetchingOrderOfPayments,
		error: orderOfPaymentsError,
	} = useOrderOfPayments({
		params: {
			...params,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
		},
	});

	// METHODS
	useEffect(() => {
		const formattedOrderOfPayments = orderOfPayments.map((orderOfPayment) => {
			const {
				id,
				datetime_created,
				amount,
				payor,
				purpose,
				extra_description,
				charge_sales_transaction,
			} = orderOfPayment;

			let purposeDescription = extra_description;
			if (purpose === orderOfPaymentPurposes.PARTIAL_PAYMENT) {
				purposeDescription = 'Partial Payment';
			} else if (purpose === orderOfPaymentPurposes.FULL_PAYMENT) {
				purposeDescription = 'Full Payment';
			}

			return {
				key: id,
				id,
				datetime: formatDateTime(datetime_created),
				payor: getFullName(payor),
				address: payor.home_address,
				amountOfPayment: formatInPeso(amount),
				purpose: purposeDescription,
				chargeSalesInvoice: charge_sales_transaction?.invoice ? (
					<>
						<Button
							className="pa-0"
							type="link"
							onClick={() => setSelectedTransaction(charge_sales_transaction)}
						>
							{charge_sales_transaction.invoice.or_number}
						</Button>
						<span>
							{' '}
							-{' '}
							{formatDateTime(
								charge_sales_transaction.invoice.datetime_created,
							)}
						</span>
					</>
				) : (
					EMPTY_CELL
				),
				actions: (
					<Tooltip title="Create PDF">
						<Button
							icon={<FilePdfOutlined />}
							loading={isPrinting === id}
							type="primary"
							ghost
							onClick={() => handleCreatePDF(orderOfPayment)}
						/>
					</Tooltip>
				),
			};
		});

		setDataSource(formattedOrderOfPayments);
	}, [orderOfPayments, isPrinting]);

	const handleCreatePDF = (orderOfPayment) => {
		setIsPrinting(orderOfPayment.id);

		const html = printOrderOfPayment(orderOfPayment);
		// eslint-disable-next-line new-cap
		const pdf = new jsPDF({
			...JSPDF_SETTINGS,
			format: 'legal',
		});

		setTimeout(() => {
			pdf.html(html, {
				filename: `OP_${orderOfPayment.id}`,
				callback: (instance) => {
					window.open(instance.output('bloburl').toString());
					setIsPrinting(null);
				},
			});
		}, 500);
	};

	return (
		<div>
			<TableHeader title="Order of Payments" wrapperClassName="pt-2 px-0" />

			<RequestErrors
				errors={convertIntoArray(orderOfPaymentsError)}
				withSpaceBottom
			/>

			<Filter isLoading={isFetchingOrderOfPayments} />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingOrderOfPayments}
				pagination={{
					current: Number(params.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
					onChange: (page, newPageSize) => {
						setQueryParams({
							page,
							pageSize: newPageSize,
						});
					},
					disabled: !dataSource,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				scroll={{ x: 1200 }}
				bordered
			/>

			{selectedTransaction && (
				<ViewTransactionModal
					transaction={selectedTransaction}
					onClose={() => setSelectedTransaction(null)}
				/>
			)}
		</div>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	// STATES
	const [accountSearch, setAccountSearch] = useState('');

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { accounts },
		isFetching: isFetchingAccounts,
	} = useAccounts({ params: { search: accountSearch } });

	// METHODS
	const handleSearchDebounced = useCallback(
		_.debounce((search) => {
			setAccountSearch(search);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Payor" spacing />
				<Select
					className="w-100"
					defaultActiveFirstOption={false}
					filterOption={false}
					notFoundContent={isFetchingAccounts ? <Spin size="small" /> : null}
					value={params.payorId ? Number(params.payorId) : null}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ payorId: value }, { shouldResetPage: true });
					}}
					onSearch={handleSearchDebounced}
				>
					{accounts.map((account) => (
						<Select.Option key={account.id} value={account.id}>
							{getFullName(account)}
						</Select.Option>
					))}
				</Select>
			</Col>
			<Col lg={12} span={24}>
				<TimeRangeFilter disabled={isLoading} />
			</Col>
		</Row>
	);
};
