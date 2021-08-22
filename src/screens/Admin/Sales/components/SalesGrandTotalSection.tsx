import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '../../../../components/elements';
import { request, timeRangeTypes } from '../../../../global/types';
import { useBranches } from '../../../../hooks/useBranches';
import { useBranchMachines } from '../../../../hooks/useBranchMachines';
import { INTERVAL_MS } from './constants';
import { SalesTotalCard } from './SalesTotalCard';

interface Props {
	timeRange: string;
	timeRangeOption: string;
}

export const SalesGrandTotalSection = ({
	timeRange,
	timeRangeOption,
}: Props) => {
	// STATES
	const [branchSales, setBranchSales] = useState(0);
	const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);

	// CUSTOM HOOKS
	const { branches } = useBranches();
	const { retrieveBranchMachineSalesAll, status: branchMachinesStatus } =
		useBranchMachines();

	// REFS
	const intervalRef = useRef(null);

	// METHODS
	useEffect(() => {
		if (timeRangeOption !== timeRangeTypes.DATE_RANGE) {
			setIsCompletedInitialFetch(false);
			fetchBranchMachineSales(timeRangeOption);
		}
	}, [timeRangeOption]);

	useEffect(() => {
		if (timeRangeOption === timeRangeTypes.DATE_RANGE && timeRange !== null) {
			setIsCompletedInitialFetch(false);
			fetchBranchMachineSales(timeRange);
		}
	}, [timeRange, timeRangeOption]);

	const getBranchIds = useCallback(
		() => branches.map(({ id }) => id),
		[branches],
	);

	const fetchBranchMachineSales = (range) => {
		const branchIds = getBranchIds();
		retrieveBranchMachineSalesAll(
			{ branchIds, timeRange: range },
			({ status, data }) => {
				if ([request.SUCCESS, request.ERROR].includes(status)) {
					setIsCompletedInitialFetch(true);
				}

				if (status === request.SUCCESS) {
					const newBranchSales = data.reduce(
						(prevSales, sales) =>
							sales.reduce(
								(prevCashierSales, { sales: cashierSales }) =>
									prevCashierSales + cashierSales,
								0,
							) + prevSales,
						0,
					);

					setBranchSales(newBranchSales);
				}
			},
		);

		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			retrieveBranchMachineSalesAll({ branchIds, timeRange: range });
		}, INTERVAL_MS);
	};

	return (
		<Box padding>
			<SalesTotalCard
				title="Grand Total Sales"
				totalSales={branchSales}
				timeRange={timeRange}
				timeRangeOption={timeRangeOption}
				loading={branchMachinesStatus === request.REQUESTING}
				firstTimeLoading={
					isCompletedInitialFetch
						? false
						: branchMachinesStatus === request.REQUESTING
				}
			/>
		</Box>
	);
};
