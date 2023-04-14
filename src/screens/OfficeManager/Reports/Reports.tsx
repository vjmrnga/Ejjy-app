import './style.scss';

export const Reports = () => {
	// CUSTOM HOOKS
	// const {
	// 	data: { branches },
	// } = useBranches();
	// const {
	// 	data: { productCategories },
	// 	isFetching: isFetchingProductCategories,
	// 	error: productCategoriesErrors,
	// } = useProductCategories({
	// 	params: {
	// 		pageSize: MAX_PAGE_SIZE,
	// 	},
	// });

	// // VARIABLES
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
	// 		page: 1,
	// 		pageSize: 10,
	// 	});
	// };

	return null;

	// return (
	// 	<Content className="Reports" title="Reports">
	// 		<Box>
	// 			<Spin spinning={isFetchingProductCategories}>
	// 				<RequestErrors
	// 					errors={convertIntoArray(productCategoriesErrors)}
	// 					withSpaceBottom
	// 				/>

	// 				<Tabs
	// 					type="card"
	// 					className="pa-6"
	// 					activeKey={toString(currentBranchId)}
	// 					onTabClick={onTabClick}
	// 					destroyInactiveTabPane
	// 				>
	// 					{branches.map(({ name, id, online_url }) => (
	// 						<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
	// 							<ReportsBranch
	// 								branchId={id}
	// 								productCategories={productCategories}
	// 							/>
	// 						</Tabs.TabPane>
	// 					))}
	// 				</Tabs>
	// 			</Spin>
	// 		</Box>
	// 	</Content>
	// );
};
