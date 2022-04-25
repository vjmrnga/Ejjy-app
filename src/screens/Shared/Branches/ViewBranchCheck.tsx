import { ColumnsType } from 'antd/lib/table/interface';
import './style.scss';

const columns: ColumnsType = [
	{
		title: 'Product',
		children: [
			{
				title: 'Barcode',
				dataIndex: 'barcode',
				key: 'barcode',
			},
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
			},
		],
	},
	{
		title: 'Quantity',
		children: [
			{
				title: 'Current',
				dataIndex: 'current',
				key: 'current',
				align: 'center',
			},
			{
				title: 'Fulfilled',
				dataIndex: 'fulfilled',
				key: 'fulfilled',
				align: 'center',
			},
			{
				title: 'Status',
				dataIndex: 'match_status',
				key: 'match_status',
				align: 'center',
			},
		],
	},
	{ title: 'Adjustment', dataIndex: 'adjustment' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	match: any;
}

// TODO: Implement once office manager is ready to dev
export const ViewBranchCheck = ({ match }: Props) => {
	return null;

	// // VARIABLES
	// const { id: branchId, productCheckId } = match?.params || {};
	// const branch = useSelector(
	// 	branchesSelectors.selectBranchById(Number(branchId)),
	// );

	// // STATES
	// const [productCheck, setProductCheck] = useState(null);
	// const [data, setData] = useState([]);

	// // CUSTOM HOOKS
	// const history = useHistory();
	// const { user } = useAuth();
	// const {
	// 	getProductCheck,
	// 	status: productChecksStatus,
	// 	errors: productChecksErrors,
	// } = useProductChecks();

	// // METHODS
	// useEffect(() => {
	// 	if (branch && !branch?.online_url) {
	// 		history.replace(`${getUrlPrefix(user.user_type)}/branches`);
	// 		message.error('Branch has no online url.');
	// 	}
	// }, [branchId, branch]);

	// useEffect(() => {
	// 	getProductCheck(
	// 		{
	// 			id: productCheckId,
	// 			branchId,
	// 		},
	// 		({ status, response }) => {
	// 			if (status === request.SUCCESS) {
	// 				setProductCheck(response);
	// 			}
	// 		},
	// 	);
	// }, [branchId, productCheckId]);

	// useEffect(() => {
	// 	if (productCheck) {
	// 		setData(
	// 			productCheck.products.map((item) => {
	// 				const {
	// 					id,
	// 					product,
	// 					current_quantity_piece,
	// 					fulfilled_quantity_piece,
	// 					is_match,
	// 				} = item;
	// 				const { barcode, textcode, name } = product;

	// 				return {
	// 					key: id,
	// 					name,
	// 					barcode: barcode || textcode,
	// 					current: current_quantity_piece,
	// 					fulfilled: fulfilled_quantity_piece,
	// 					match_status: is_match ? (
	// 						<BadgePill label="Matched" variant="primary" />
	// 					) : (
	// 						<BadgePill label="Not Matched" variant="error" />
	// 					),
	// 					adjustment: EMPTY_CELL,
	// 					actions: EMPTY_CELL,
	// 				};
	// 			}),
	// 		);
	// 	}
	// }, [productCheck]);

	// const getBreadcrumbItems = useCallback(
	// 	() => [
	// 		{ name: 'Branches', link: `${getUrlPrefix(user.user_type)}/branches` },
	// 		{
	// 			name: branch?.name,
	// 			link: `${getUrlPrefix(user.user_type)}/branches/${branch?.id}`,
	// 		},
	// 		{ name: productCheckId },
	// 	],
	// 	[branch, user],
	// );

	// return (
	// 	<Content
	// 		title="[VIEW] Branch Check"
	// 		rightTitle={branch?.name}
	// 		breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
	// 	>
	// 		<Box className="ViewBranchCheck">
	// 			<Spin spinning={productChecksStatus === request.REQUESTING}>
	// 				<RequestErrors
	// 					errors={convertIntoArray(productChecksErrors)}
	// 					withSpaceBottom
	// 				/>

	// 				{productCheck && (
	// 					<DetailsRow className="PaddingHorizontal PaddingVertical">
	// 						<DetailsHalf label="ID" value={productCheck.id} />
	// 						<DetailsHalf label="Type" value={upperFirst(productCheck.type)} />
	// 						<DetailsHalf
	// 							label="Date & Time Requested"
	// 							value={formatDateTime(productCheck.datetime_created)}
	// 						/>
	// 						<DetailsHalf
	// 							label="Date & Time Fulfilled"
	// 							value={
	// 								productCheck.datetime_fulfilled
	// 									? formatDateTime(productCheck.datetime_fulfilled)
	// 									: EMPTY_CELL
	// 							}
	// 						/>
	// 					</DetailsRow>
	// 				)}

	// 				<Table
	// 					columns={columns}
	// 					dataSource={data}
	// 					scroll={{ x: 800 }}
	// 					pagination={false}
	// 					bordered
	// 				/>
	// 			</Spin>
	// 		</Box>
	// 	</Content>
	// );
};
