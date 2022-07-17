// const columns: ColumnsType = [
// 	{ title: 'ID', dataIndex: 'id' },
// 	{ title: 'Date Returned', dataIndex: 'datetime_sent' },
// 	{ title: 'Date Received', dataIndex: 'datetime_received' },
// 	{ title: 'Returned By (Branch)', dataIndex: 'returned_by_branch' },
// 	{ title: 'Status', dataIndex: 'status' },
// 	{ title: 'Actions', dataIndex: 'actions' },
// ];

export const BackOrders = () => {
	return null;
	// // STATES
	// const [data, setData] = useState([]);
	// const [selectedBackOrder, setSelectedBackOrder] = useState(null);

	// // CUSTOM HOOKS
	// const {
	// 	backOrders,
	// 	pageCount,
	// 	currentPage,
	// 	pageSize,
	// 	listBackOrders,
	// 	status: backOrdersStatus,
	// } = useBackOrders();

	// // METHODS
	// useEffect(() => {
	// 	listBackOrders({ page: 1 });
	// }, []);

	// useEffect(() => {
	// 	setData(
	// 		backOrders.map((backOrder) => ({
	// 			key: backOrder.id,
	// 			id: (
	// 				<Link to={`/office-manager/back-orders/${backOrder.id}`}>
	// 					{backOrder.id}
	// 				</Link>
	// 			),
	// 			datetime_sent: backOrder.datetime_sent
	// 				? formatDateTime(backOrder.datetime_sent)
	// 				: EMPTY_CELL,
	// 			datetime_received: backOrder.datetime_received
	// 				? formatDateTime(backOrder.datetime_received)
	// 				: EMPTY_CELL,
	// 			returned_by_branch: backOrder.sender.branch.name,
	// 			status: getBackOrderStatus(backOrder.status),
	// 			actions:
	// 				backOrder.status === backOrdersStatuses.PENDING ? (
	// 					<AddButtonIcon
	// 						onClick={() => setSelectedBackOrder(backOrder)}
	// 						tooltip="Assign"
	// 					/>
	// 				) : null,
	// 		})),
	// 	);
	// }, [backOrders]);

	// const onPageChange = (page, newPageSize) => {
	// 	listBackOrders(
	// 		{
	// 			page,
	// 			pageSize: newPageSize,
	// 		},
	// 		newPageSize !== pageSize,
	// 	);
	// };

	// return (
	// 	<Content title="Back Orders">
	// 		<Box>
	// 			<Table
	// 				columns={columns}
	// 				dataSource={data}
	// 				scroll={{ x: 800 }}
	// 				pagination={{
	// 					current: currentPage,
	// 					total: pageCount,
	// 					pageSize,
	// 					onChange: onPageChange,
	// 					disabled: !data,
	// 					position: ['bottomCenter'],
	// 					pageSizeOptions,
	// 				}}
	// 				loading={backOrdersStatus === request.REQUESTING}
	// 			/>
	// 		</Box>

	// 		{selectedBackOrder && (
	// 			<AssignBackOrderModal
	// 				backOrder={selectedBackOrder}
	// 				onSuccess={() => listBackOrders({ page: 1 }, true)}
	// 				onClose={() => setSelectedBackOrder(null)}
	// 			/>
	// 		)}
	// 	</Content>
	// );
};
