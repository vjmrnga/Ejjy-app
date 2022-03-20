import { Col, Row, Statistic } from 'antd';
import React from 'react';
import { formatInPeso } from 'utils/function';
import './style.scss';

interface Props {
	totalSales: any;
	totalVatSales: number;
	totalVatExemptSales;
}

export const DailyProductSalesReportTotal = ({
	totalSales,
	totalVatSales,
	totalVatExemptSales,
}: Props) => (
	<div className="DailyProductSalesReportTotal mb-4">
		<Row gutter={[16, 16]}>
			<Col span={24} md={8}>
				<Statistic title="Total Amount" value={formatInPeso(totalSales)} />
			</Col>
			<Col span={24} md={8}>
				<Statistic
					title="Total Vat Sales"
					value={formatInPeso(totalVatSales)}
				/>
			</Col>
			<Col span={24} md={8}>
				<Statistic
					title="Total Vat Exmpt Sales"
					value={formatInPeso(totalVatExemptSales)}
				/>
			</Col>
		</Row>
	</div>
);
