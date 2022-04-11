export const SalesBranchSection = () => {
	return null;
	// // CUSTOM HOOKS
	// const { branches } = useBranches();
	// const {
	// 	params: { branchId: currentBranchId },
	// 	setQueryParams,
	// } = useQueryParams();

	// // METHODS
	// useEffect(() => {
	// 	if (branches && !currentBranchId) {
	// 		onTabClick(branches?.[0]?.id);
	// 	}
	// }, [branches, currentBranchId]);

	// const onTabClick = (branchId) => {
	// 	setQueryParams({
	// 		branchId,
	// 	});
	// };

	// return (
	// 	<Box>
	// 		<Tabs
	// 			type="card"
	// 			className="PaddingHorizontal PaddingVertical"
	// 			activeKey={toString(currentBranchId)}
	// 			onTabClick={onTabClick}
	// 			destroyInactiveTabPane
	// 		>
	// 			{branches.map(({ name, id, online_url }) => (
	// 				<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
	// 					<SalesBranch branchId={id} />
	// 				</Tabs.TabPane>
	// 			))}
	// 		</Tabs>
	// 	</Box>
	// );
};
