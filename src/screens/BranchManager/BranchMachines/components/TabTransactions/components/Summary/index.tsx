import { Col, Row, Spin, Statistic } from 'antd';
import { RequestErrors } from 'components';
import { refetchOptions, timeRangeTypes } from 'global';
import { useQueryParams, useTransactionsSummary } from 'hooks';
import React from 'react';
import { convertIntoArray, formatInPeso } from 'utils';
import './style.scss';

interface Props {
	branchMachineId: number;
}

const Component = ({ branchMachineId }: Props) => {
	const { params } = useQueryParams();
	const {
		data: { summary = null } = {},
		error: transactionsSummaryError,
		isLoading: isTransactionsSummaryLoading,
	} = useTransactionsSummary({
		params: {
			...params,
			branchMachineId,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
		},
		options: {
			...refetchOptions,
			notifyOnChangeProps: ['data', 'isLoading'],
		},
	});

	return (
		<div className="Summary mb-4">
			<RequestErrors
				errors={convertIntoArray(transactionsSummaryError)}
				withSpaceBottom
			/>

			<Spin spinning={isTransactionsSummaryLoading}>
				<Row gutter={[16, 16]}>
					<Col md={8} sm={8} xs={24}>
						<Statistic
							title="Vatable Sales"
							value={formatInPeso(summary?.vatable_sales)}
						/>
					</Col>
					<Col md={16} sm={16} xs={24}>
						<Statistic
							title="Voided Total"
							value={formatInPeso(summary?.total_voided_sales)}
						/>
					</Col>

					<Col md={8} sm={8} xs={24}>
						<Statistic
							title="Vat Amount"
							value={formatInPeso(summary?.vat_amount)}
						/>
					</Col>
					<Col md={16} sm={16} xs={24}>
						<Statistic
							title="Discount Total"
							value={formatInPeso(summary?.total_discount)}
						/>
					</Col>

					<Col md={8} sm={8} xs={24}>
						<Statistic
							title="Vat Exempt Sales"
							value={formatInPeso(summary?.vat_exempt_sales)}
						/>
					</Col>

					<Col md={16} sm={16} xs={24}>
						<Statistic
							title="Vat Payable"
							value={formatInPeso(summary?.vat_amount)}
						/>
					</Col>

					<Col md={8} sm={8} xs={24}>
						<Statistic
							title="TOTAL GROSS SALES"
							value={formatInPeso(summary?.total_gross_sales)}
						/>
					</Col>
					<Col md={8} sm={8} xs={24}>
						<Statistic
							title="TOTAL DEDUCTIONS"
							value={formatInPeso(summary?.total_deductions)}
						/>
					</Col>
					<Col md={8} sm={8} xs={24}>
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

export const Summary = React.memo(Component);
