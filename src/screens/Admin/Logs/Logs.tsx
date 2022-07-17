/* eslint-disable no-mixed-spaces-and-tabs */
// import { Content } from '../../../components';
// import { EMPTY_CELL, MAX_PAGE_SIZE } from '../../../global/constants';
// import { formatDateTimeExtended } from 'utils';

// const columns: ColumnsType = [
// 	{ title: 'Branch', dataIndex: 'branch', width: 150, fixed: 'left' },
// 	{ title: 'User', dataIndex: 'user' },
// 	{ title: 'Description', dataIndex: 'description' },
// 	{ title: 'Date & Time', dataIndex: 'datetime_created' },
// ];

// TODO: Implement this once Admin side is ready to work on
export const Logs = () => {
	return null;
	// // STATES
	// const [data, setData] = useState([]);

	// // CUSTOM HOOKS
	// const { branches, getBranches, status: branchesStatus } = useBranches();
	// const { users, getOnlineUsers, status: usersStatus } = useUsers();
	// const {
	// 	logs,
	// 	pageCount,
	// 	currentPage,
	// 	pageSize,
	// 	listLogs,
	// 	status: logsStatus,
	// } = useLogs();

	// const { setQueryParams } = useQueryParams({
	// 	page: currentPage,
	// 	pageSize,
	// 	onQueryParamChange: (params) => {
	// 		listLogs(params, true);
	// 	},
	// });

	// // METHODS
	// useEffect(() => {
	// 	getBranches();
	// 	getOnlineUsers({ page: 1, pageSize: MAX_PAGE_SIZE });
	// }, []);

	// useEffect(() => {
	// 	const formattedLogs =
	// 		logs?.map((log) => ({
	// 			branch: log?.branch?.name || EMPTY_CELL,
	// 			user: log.acting_user
	// 				? `${log.acting_user.first_name} ${log.acting_user.last_name}`
	// 				: EMPTY_CELL,
	// 			description: log.description,
	// 			datetime_created: formatDateTimeExtended(log.datetime_created),
	// 		})) || [];

	// 	setData(formattedLogs);
	// }, [logs]);

	// return (
	// 	<Content title="Logs">
	// 		<section className="Logs">
	// 			<Box>
	// 				<Filter
	// 					users={users}
	// 					usersLoading={usersStatus === request.REQUESTING}
	// 					branches={branches}
	// 					branchesLoading={branchesStatus === request.REQUESTING}
	// 					setQueryParams={(params) => {
	// 						setQueryParams(params, { shouldResetPage: true });
	// 					}}
	// 				/>
	// 				<Table
	// 					columns={columns}
	// 					dataSource={data}
	// 					scroll={{ x: 1000 }}
	// 					pagination={{
	// 						current: currentPage,
	// 						total: pageCount,
	// 						pageSize,
	// 						onChange: (page, newPageSize) => {
	// 							setQueryParams({
	// 								page,
	// 								pageSize: newPageSize,
	// 							});
	// 						},
	// 						disabled: !data,
	// 						position: ['bottomCenter'],
	// 						pageSizeOptions,
	// 					}}
	// 					loading={logsStatus === request.REQUESTING}
	// 				/>
	// 			</Box>
	// 		</section>
	// 	</Content>
	// );
};

// interface FilterProps {
// 	users: IUser[];
// 	usersLoading: boolean;
// 	branches: IBranch[];
// 	branchesLoading: boolean;
// 	setQueryParams: any;
// }

// const Filter = ({
// 	users,
// 	usersLoading,
// 	branches,
// 	branchesLoading,
// 	setQueryParams,
// }: FilterProps) => {
// 	// CUSTOM HOOKS
// 	const history = useHistory();
// 	const params = queryString.parse(history.location.search);

// 	return (
// 		<Row className="PaddingHorizontal PaddingVertical" gutter={[16, 16]}>
// 			<Col lg={12} span={24}>
// 				<Label label="Branch" spacing />
// 				<Select
// 					defaultValue={params.branchId}
// 					filterOption={(input, option) =>
// 						option.children
// 							.toString()
// 							.toLowerCase()
// 							.indexOf(input.toLowerCase()) >= 0
// 					}
// 					loading={branchesLoading}
// 					optionFilterProp="children"
// 					style={{ width: '100%' }}
// 					allowClear
// 					showSearch
// 					onChange={(value) => {
// 						setQueryParams({ branchId: value });
// 					}}
// 				>
// 					{branches.map(({ id, name }) => (
// 						<Select.Option value={id}>{name}</Select.Option>
// 					))}
// 				</Select>
// 			</Col>

// 			<Col lg={12} span={24}>
// 				<Label label="User" spacing />
// 				<Select
// 					defaultValue={params.actingUserId}
// 					filterOption={(input, option) =>
// 						option.children
// 							.toString()
// 							.toLowerCase()
// 							.indexOf(input.toLowerCase()) >= 0
// 					}
// 					loading={usersLoading}
// 					optionFilterProp="children"
// 					style={{ width: '100%' }}
// 					allowClear
// 					showSearch
// 					onChange={(value) => {
// 						setQueryParams({ actingUserId: value });
// 					}}
// 				>
// 					{users.map(({ id, first_name, last_name }) => (
// 						<Select.Option value={id}>
// 							{`${first_name} ${last_name}`}
// 						</Select.Option>
// 					))}
// 				</Select>
// 			</Col>

// 			<Col lg={12} span={24}>
// 				<Label label="Date Range" spacing />
// 				<DatePicker.RangePicker
// 					defaultPickerValue={
// 						toString(params.timeRange).split(',')?.length === 2
// 							? [
// 									moment(toString(params.timeRange).split(',')[0]),
// 									moment(toString(params.timeRange).split(',')[1]),
// 							  ]
// 							: undefined
// 					}
// 					defaultValue={
// 						toString(params.timeRange).split(',')?.length === 2
// 							? [
// 									moment(toString(params.timeRange).split(',')[0]),
// 									moment(toString(params.timeRange).split(',')[1]),
// 							  ]
// 							: undefined
// 					}
// 					format="MM/DD/YY"
// 					style={{ width: '100%' }}
// 					onCalendarChange={(dates, dateStrings) => {
// 						if (dates?.[0] && dates?.[1]) {
// 							setQueryParams({ timeRange: dateStrings.join(',') });
// 						}
// 					}}
// 				/>
// 			</Col>
// 		</Row>
// 	);
// };
