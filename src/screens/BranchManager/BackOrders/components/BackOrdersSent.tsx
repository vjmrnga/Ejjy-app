// const columns: ColumnsType = [
// 	{ title: 'ID', dataIndex: 'id' },
// 	{ title: 'Date Sent', dataIndex: 'datetime_sent' },
// 	{ title: 'Status', dataIndex: 'status' },
// ];

// interface Props {
// 	selectBackOrder: any;
// }

export const BackOrdersSent = () => {
	return null;
	// // STATES
	// const [data, setData] = useState([]);

	// // CUSTOM HOOKS
	// const { user } = useAuth();
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
	// 	listBackOrders({
	// 		senderBranchId: user?.branch?.id,
	// 		page: 1,
	// 	});
	// }, []);

	// useEffect(() => {
	// 	// NOTE: We temporarily override the datetime_sent into datetime_created. Need to verify this will be continued or not.
	// 	setData(
	// 		backOrders.map((backOrder) => ({
	// 			key: backOrder.id,
	// 			id: (
	// 				<ButtonLink
	// 					text={backOrder.id}
	// 					onClick={() => selectBackOrder(backOrder)}
	// 				/>
	// 			),
	// 			datetime_sent: backOrder.datetime_created
	// 				? formatDateTime(backOrder.datetime_created)
	// 				: EMPTY_CELL,
	// 			status: getBackOrderStatus(backOrder.status),
	// 		})),
	// 	);
	// }, [backOrders]);

	// const onPageChange = (page, newPageSize) => {
	// 	listBackOrders(
	// 		{
	// 			// NOTE: We temporarily disabled the receiverId. Need to verify this will be continued or not.
	// 			// receiverId: user?.id,
	// 			page,
	// 			pageSize: newPageSize,
	// 		},
	// 		newPageSize !== pageSize,
	// 	);
	// };

	// return (
	// 	<Table
	// 		columns={columns}
	// 		dataSource={data}
	// 		pagination={{
	// 			current: currentPage,
	// 			total: pageCount,
	// 			pageSize,
	// 			onChange: onPageChange,
	// 			disabled: !data,
	// 			position: ['bottomCenter'],
	// 			pageSizeOptions,
	// 		}}
	// 		loading={backOrdersStatus === request.REQUESTING}
	// 	/>
	// );
};
