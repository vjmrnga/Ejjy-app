import { Button, Col, Row, Select, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	CreateOrderOfPaymentModal,
	RequestErrors,
	TableHeader,
	TimeRangeFilter,
	ViewTransactionModal,
} from 'components';
import { Label } from 'components/elements';
import { printOrderOfPayment } from 'configurePrinter';
import {
	EMPTY_CELL,
	orderOfPaymentPurposes,
	pageSizeOptions,
	SEARCH_DEBOUNCE_TIME,
	timeRangeTypes,
} from 'global';
import { useAccounts, useOrderOfPayments, useQueryParams } from 'hooks';
import { useTimeRange } from 'hooks/useTimeRange';
import { jsPDF } from 'jspdf';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDateTime,
	formatInPeso,
	getFullName,
} from 'utils/function';

const columns: ColumnsType = [
	{ title: 'OP #', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Payor', dataIndex: 'payor' },
	{ title: 'Address', dataIndex: 'address' },
	{ title: 'Amount of Payment', dataIndex: 'amount_of_payment' },
	{ title: 'Purpose', dataIndex: 'purpose' },
	{ title: 'Charge Sales Invoice', dataIndex: 'charge_sales_invoice' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabOrderOfPayments = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	// NOTE: Will store the ID of the order of payment that is about to be printed.
	const [isPrinting, setIsPrinting] = useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams({
		onParamsCheck: ({ timeRange }) => {
			const newParams = {};

			if (!_.toString(timeRange)) {
				// eslint-disable-next-line dot-notation
				newParams['timeRange'] = timeRangeTypes.DAILY;
			}

			return newParams;
		},
	});
	const {
		data: { orderOfPayments, total },
		refetch: refetchOrderOfPayments,
		isFetching,
		error,
	} = useOrderOfPayments({ params: queryParams });

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
				datetime_created: formatDateTime(datetime_created),
				payor: getFullName(payor),
				address: payor.home_address,
				amount_of_payment: formatInPeso(amount),
				purpose: purposeDescription,
				charge_sales_invoice: charge_sales_transaction?.invoice ? (
					<>
						<Button
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
					<Button
						type="link"
						onClick={() => onPrintPDF(orderOfPayment)}
						loading={isPrinting === id}
					>
						Print PDF
					</Button>
				),
			};
		});

		setDataSource(formattedOrderOfPayments);
	}, [orderOfPayments, isPrinting]);

	const onPrintPDF = (orderOfPayment) => {
		setIsPrinting(orderOfPayment.id);

		const html = printOrderOfPayment(orderOfPayment);
		const pdf = new jsPDF({
			orientation: 'p',
			unit: 'px',
			format: 'legal',
			hotfixes: ['px_scaling'],
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
			<TableHeader
				title="Order of Payments"
				buttonName="Create Order of Payment"
				onCreate={() => setIsCreateModalVisible(true)}
			/>

			<Filter
				params={queryParams}
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
				isLoading={isFetching}
			/>

			<RequestErrors errors={convertIntoArray(error)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 1200 }}
				pagination={{
					current: Number(queryParams.page) || 1,
					total,
					pageSize: Number(queryParams.pageSize) || 10,
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
				loading={isFetching}
			/>

			{selectedTransaction && (
				<ViewTransactionModal
					transaction={selectedTransaction}
					onClose={() => setSelectedTransaction(null)}
				/>
			)}

			{isCreateModalVisible && (
				<CreateOrderOfPaymentModal
					onSuccess={refetchOrderOfPayments}
					onClose={() => setIsCreateModalVisible(false)}
				/>
			)}
		</div>
	);
};

interface FilterProps {
	params: any;
	isLoading: boolean;
	setQueryParams: any;
}

const Filter = ({ params, isLoading, setQueryParams }: FilterProps) => {
	// STATES
	const [accountSearch, setAccountSearch] = useState('');

	// CUSTOM HOOKS
	const { timeRangeType, setTimeRangeType } = useTimeRange({ params });
	const {
		isFetching,
		data: { accounts },
	} = useAccounts({ params: { search: accountSearch } });

	// METHODS
	const onSearchDebounced = useCallback(
		_.debounce((search) => {
			setAccountSearch(search);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Row className="mb-4" gutter={[15, 15]}>
			<Col lg={12} span={24}>
				<Label label="Payor" spacing />
				<Select
					style={{ width: '100%' }}
					filterOption={false}
					defaultActiveFirstOption={false}
					onSearch={onSearchDebounced}
					notFoundContent={isFetching ? <Spin size="small" /> : null}
					value={params.payorId ? Number(params.payorId) : null}
					onChange={(value) => {
						setQueryParams({ payorId: value });
					}}
					showSearch
					allowClear
				>
					{accounts.map((account) => (
						<Select.Option key={account.id} value={account.id}>
							{getFullName(account)}
						</Select.Option>
					))}
				</Select>
			</Col>
			<Col lg={12} span={24}>
				<TimeRangeFilter
					timeRange={params.timeRange}
					timeRangeType={timeRangeType}
					setTimeRangeType={setTimeRangeType}
					setQueryParams={setQueryParams}
					disabled={isLoading}
				/>
			</Col>
		</Row>
	);
};
