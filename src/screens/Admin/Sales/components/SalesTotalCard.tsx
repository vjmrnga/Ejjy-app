import '../style.scss';

// interface Props {
// 	title?: string;
// 	totalSales: number;
// 	timeRange: string;
// 	firstTimeLoading: boolean;
// 	loading: boolean;
// }

export const SalesTotalCard = () => {
	return null;
	// const getTotalSalesDescription = useCallback(() => {
	// 	let description = null;

	// 	if (timeRange === timeRangeTypes.DAILY) {
	// 		description = 'Daily';
	// 	} else if (timeRange === timeRangeTypes.MONTHLY) {
	// 		description = 'Monthly';
	// 	} else {
	// 		const dates = timeRange.split(',');

	// 		if (dates.length === 2) {
	// 			description = dates.join(' - ');
	// 		}
	// 	}

	// 	return description;
	// }, [timeRange]);

	// return (
	// 	<Box className="SalesTotalCard">
	// 		<Spin spinning={firstTimeLoading}>
	// 			<div className="SalesTotalCard_container">
	// 				<div>
	// 					<p className="SalesTotalCard_title">{title}</p>
	// 					<span className="SalesTotalCard_description">
	// 						{getTotalSalesDescription()}

	// 						{loading && (
	// 							<LoadingOutlined className="SalesTotalCard_spinner" />
	// 						)}
	// 					</span>
	// 				</div>

	// 				<span className="SalesTotalCard_total">
	// 					{formatInPeso(totalSales)}
	// 				</span>
	// 			</div>
	// 		</Spin>
	// 	</Box>
	// );
};
