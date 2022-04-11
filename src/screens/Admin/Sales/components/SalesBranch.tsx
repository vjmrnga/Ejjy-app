import { ColumnsType } from 'antd/lib/table/interface';

// const columns: ColumnsType = [
// 	{
// 		title: 'Machine Name',
// 		dataIndex: 'machine_name',
// 	},
// 	{
// 		title: 'Sales',
// 		dataIndex: 'sales',
// 	},
// ];

interface Props {
	branchId: number;
}

export const SalesBranch = ({ branchId }: Props) => {
	return null;

	// // STATES
	// const [data, setData] = useState([]);
	// const [sales, setSales] = useState([]);
	// const [totalSales, setTotalSales] = useState(0);
	// const [isCompletedInitialFetch, setIsCompletedInitialFetch] = useState(false);

	// // CUSTOM HOOKS
	// const history = useHistory();
	// const currentParams = queryString.parse(history.location.search);
	// const {
	// 	data: { branchMachines },
	// 	isFetching,
	// 	error,
	// } = useBranchMachines({
	// 	params: {
	// 		pageSize: MAX_PAGE_SIZE,
	// 	},
	// });

	// useQueryParams({
	// 	onQueryParamChange: (params) => {
	// 		const { timeRange } = params;

	// 		if (timeRange) {
	// 			setIsCompletedInitialFetch(false);
	// 			const onCallback = ({ status, data: branchSales }) => {
	// 				if (status === request.SUCCESS) {
	// 					setSales(branchSales);
	// 				}
	// 			};

	// 			retrieveBranchMachineSales({ branchId, timeRange }, onCallback);

	// 			clearInterval(intervalRef.current);
	// 			intervalRef.current = setInterval(() => {
	// 				retrieveBranchMachineSales({ branchId, timeRange }, onCallback);
	// 			}, INTERVAL_MS);
	// 		}
	// 	},
	// });

	// // REFS
	// const intervalRef = useRef(null);

	// // METHODS
	// useEffect(
	// 	() => () => {
	// 		// Cleanup in case logged out due to single sign on
	// 		clearInterval(intervalRef.current);
	// 	},
	// 	[],
	// );

	// useEffect(() => {
	// 	if (!isCompletedInitialFetch && sales.length) {
	// 		setIsCompletedInitialFetch(true);
	// 	}

	// 	const newSales = sales?.map(
	// 		({ id: key, folder_name, sales: branchSales }) => ({
	// 			key,
	// 			machine_name: folder_name,
	// 			sales: formatInPeso(branchSales),
	// 		}),
	// 	);

	// 	const newTotalSales = sales.reduce(
	// 		(prev, { sales: branchSales }) => prev + branchSales,
	// 		0,
	// 	);

	// 	setData(newSales);
	// 	setTotalSales(newTotalSales);
	// }, [sales]);

	// return (
	// 	<div>
	// 		<RequestErrors
	// 			errors={convertIntoArray(branchMachinesErrors)}
	// 			withSpaceBottom
	// 		/>

	// 		<Row gutter={[16, 16]}>
	// 			<Col span={24}>
	// 				<SalesTotalCard
	// 					title="Total Sales"
	// 					totalSales={totalSales}
	// 					timeRange={toString(currentParams.timeRange)}
	// 					loading={branchMachinesStatus === request.REQUESTING}
	// 					firstTimeLoading={
	// 						isCompletedInitialFetch
	// 							? false
	// 							: branchMachinesStatus === request.REQUESTING
	// 					}
	// 				/>
	// 			</Col>

	// 			<Col span={24}>
	// 				<Table
	// 					className="table TableNoPadding"
	// 					columns={columns}
	// 					dataSource={data}
	// 					scroll={{ x: 500 }}
	// 					pagination={false}
	// 					loading={
	// 						isCompletedInitialFetch
	// 							? false
	// 							: branchMachinesStatus === request.REQUESTING
	// 					}
	// 				/>
	// 			</Col>
	// 		</Row>
	// 	</div>
	// );
};
