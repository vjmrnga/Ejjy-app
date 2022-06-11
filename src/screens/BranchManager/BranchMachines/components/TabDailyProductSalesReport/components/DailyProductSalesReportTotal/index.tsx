import { Col, Row, Statistic } from 'antd';
import React from 'react';
import { formatInPeso } from 'utils';
import './style.scss';

interface Props {
	totalSales: any;
	totalVatSales: number;
	totalVatExemptSales: number;
	totalAmountVoidedTransactions: number;
}

export const DailyProductSalesReportTotal = ({
	totalSales,
	totalVatSales,
	totalVatExemptSales,
	totalAmountVoidedTransactions,
}: Props) => (
	<div className="DailyProductSalesReportTotal mb-4">
		<Row gutter={[16, 16]}>
			<Col xs={24} sm={12} md={6}>
				<Statistic title="Net Sales" value={formatInPeso(totalSales)} />
			</Col>
			<Col xs={24} sm={12} md={6}>
				<Statistic
					title="Total Vat Sales"
					value={formatInPeso(totalVatSales)}
				/>
			</Col>
			<Col xs={24} sm={12} md={6}>
				<Statistic
					title="Total Vat Exempt Sales"
					value={formatInPeso(totalVatExemptSales)}
				/>
			</Col>
			<Col xs={24} sm={12} md={6}>
				<Statistic
					title="Total Amount of Voided Transactions"
					value={formatInPeso(totalAmountVoidedTransactions)}
				/>
			</Col>
		</Row>
	</div>
);
