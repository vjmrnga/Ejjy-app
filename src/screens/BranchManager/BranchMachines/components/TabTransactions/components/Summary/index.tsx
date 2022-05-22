import { Col, Row, Spin, Statistic } from 'antd';
import { RequestErrors } from 'components';
import { useQueryParams, useTransactionsSummary } from 'hooks';
import React from 'react';
import { convertIntoArray, formatInPeso } from 'utils/function';
import './style.scss';

interface Props {
	branchMachineId: number;
}

export const Summary = ({ branchMachineId }: Props) => {
	const { params } = useQueryParams();
	const {
		data: { summary = null } = {},
		isFetching: isFetchingTransactionsSummary,
		error: transactionsSummaryError,
	} = useTransactionsSummary({
		params: {
			branchMachineId,
			...params,
		},
	});

	return (
		<div className="Summary mb-4">
			<RequestErrors
				withSpaceBottom
				errors={convertIntoArray(transactionsSummaryError)}
			/>

			<Spin spinning={isFetchingTransactionsSummary}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={8} md={8}>
						<Statistic
							title="Vatable Sales"
							value={formatInPeso(summary?.vatable_sales)}
						/>
					</Col>
					<Col xs={24} sm={16} md={16}>
						<Statistic
							title="Voided Total"
							value={formatInPeso(summary?.total_voided_sales)}
						/>
					</Col>

					<Col xs={24} sm={8} md={8}>
						<Statistic
							title="Vat Amount"
							value={formatInPeso(summary?.vat_amount)}
						/>
					</Col>
					<Col xs={24} sm={16} md={16}>
						<Statistic
							title="Discount Total"
							value={formatInPeso(summary?.total_discount)}
						/>
					</Col>

					<Col xs={24}>
						<Statistic
							title="Vat Exempt Sales"
							value={formatInPeso(summary?.vat_exempt_sales)}
						/>
					</Col>

					<Col xs={24} sm={8} md={8}>
						<Statistic
							title="TOTAL GROSS SALES"
							value={formatInPeso(summary?.total_gross_sales)}
						/>
					</Col>
					<Col xs={24} sm={8} md={8}>
						<Statistic
							title="TOTAL DEDUCTIONS"
							value={formatInPeso(summary?.total_deductions)}
						/>
					</Col>
					<Col xs={24} sm={8} md={8}>
						<Statistic
							title="NET SALES"
							value={formatInPeso(summary?.total_net_sales)}
						/>
					</Col>
				</Row>
			</Spin>
		</div>
	);
};
