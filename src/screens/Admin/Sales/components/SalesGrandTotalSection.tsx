export const SalesGrandTotalSection = () => {
	return null;
	// // STATES
	// const [branchSales, setBranchSales] = useState(0);
	// const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);

	// // CUSTOM HOOKS
	// const history = useHistory();
	// const currentParams = queryString.parse(history.location.search);
	// const { branches } = useBranches();
	// const { retrieveBranchMachineSalesAll, status: branchMachinesStatus } =
	// 	useBranchMachines();

	// useQueryParams({
	// 	onQueryParamChange: (params) => {
	// 		const { timeRange } = params;

	// 		if (timeRange) {
	// 			const branchIds = getBranchIds();
	// 			retrieveBranchMachineSalesAll(
	// 				{ branchIds, timeRange },
	// 				({ status, data }) => {
	// 					if ([request.SUCCESS, request.ERROR].includes(status)) {
	// 						setIsCompletedInitialFetch(true);
	// 					}

	// 					if (status === request.SUCCESS) {
	// 						const newBranchSales = data.reduce(
	// 							(prevSales, sales) =>
	// 								sales.reduce(
	// 									(prevCashierSales, { sales: cashierSales }) =>
	// 										prevCashierSales + cashierSales,
	// 									0,
	// 								) + prevSales,
	// 							0,
	// 						);

	// 						setBranchSales(newBranchSales);
	// 					}
	// 				},
	// 			);

	// 			clearInterval(intervalRef.current);
	// 			intervalRef.current = setInterval(() => {
	// 				retrieveBranchMachineSalesAll({ branchIds, timeRange });
	// 			}, INTERVAL_MS);
	// 		}
	// 	},
	// });

	// // REFS
	// const intervalRef = useRef(null);

	// // METHODS

	// const getBranchIds = useCallback(
	// 	() => branches.map(({ id }) => id),
	// 	[branches],
	// );

	// return (
	// 	<Box padding>
	// 		<SalesTotalCard
	// 			title="Grand Total Sales"
	// 			totalSales={branchSales}
	// 			timeRange={toString(currentParams.timeRange)}
	// 			loading={branchMachinesStatus === request.REQUESTING}
	// 			firstTimeLoading={
	// 				isCompletedInitialFetch
	// 					? false
	// 					: branchMachinesStatus === request.REQUESTING
	// 			}
	// 		/>
	// 	</Box>
	// );
};
