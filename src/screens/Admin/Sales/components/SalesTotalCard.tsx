import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { useCallback } from 'react';
import { Box } from '../../../../components/elements';
import { timeRangeTypes } from '../../../../global/types';
import { numberWithCommas } from '../../../../utils/function';
import '../style.scss';

interface Props {
	title?: string;
	totalSales: number;
	timeRange: string;
	timeRangeOption: string;
	firstTimeLoading: boolean;
	loading: boolean;
}

export const SalesTotalCard = ({
	title,
	totalSales,
	timeRange,
	timeRangeOption,
	firstTimeLoading,
	loading,
}: Props) => {
	const getTotalSalesDescription = useCallback(() => {
		let description = null;

		if (timeRangeOption === timeRangeTypes.DAILY) {
			description = 'Daily';
		} else if (timeRangeOption === timeRangeTypes.MONTHLY) {
			description = 'Monthly';
		} else if (timeRangeOption === timeRangeTypes.DATE_RANGE && timeRange) {
			const dates = timeRange.split(',');

			if (dates.length === 2) {
				description = dates.join(' - ');
			}
		}

		return description;
	}, [timeRangeOption, timeRange]);

	return (
		<Box className="SalesTotalCard">
			<Spin spinning={firstTimeLoading}>
				<div className="SalesTotalCard_container">
					<div>
						<p className="SalesTotalCard_title">{title}</p>
						<span className="SalesTotalCard_description">
							{getTotalSalesDescription()}

							{loading && (
								<LoadingOutlined className="SalesTotalCard_spinner" />
							)}
						</span>
					</div>

					<span className="SalesTotalCard_total">
						{`₱${numberWithCommas(totalSales.toFixed(2))}`}
					</span>
				</div>
			</Spin>
		</Box>
	);
};
