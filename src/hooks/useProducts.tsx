import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ProductsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useProducts = ({ params }: Query) =>
	useQuery<any>(
		[
			'useProducts',
			params?.page,
			params?.pageSize,
			params?.search,
			params?.productCategory,
			params?.ids,
		],
		async () =>
			ProductsService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					ids: params?.ids,
					search: params?.search,
					product_category: params?.productCategory,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				products: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useProductCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({
			actingUserId,
			allowableSpoilage,
			barcode,
			costPerBulk,
			costPerPiece,
			description,
			hasQuantityAllowance,
			isShownInScaleList,
			isVatExempted,
			maxBalance,
			name,
			packingBarcode,
			packingBarcodeUnitOfMeasurement,
			piecesInBulk,
			pointSystemTagId,
			pricePerBulk,
			pricePerPiece,
			printDetails,
			productCategory,
			reorderPoint,
			sellingBarcode,
			sellingBarcodeUnitOfMeasurement,
			textcode,
			type,
			unitOfMeasurement,
		}: any) =>
			ProductsService.create(
				{
					acting_user_id: actingUserId,
					allowable_spoilage: allowableSpoilage,
					barcode: barcode,
					cost_per_bulk: costPerBulk,
					cost_per_piece: costPerPiece,
					description: description,
					has_quantity_allowance: hasQuantityAllowance,
					is_shown_in_scale_list: isShownInScaleList,
					is_vat_exempted: isVatExempted,
					max_balance: maxBalance,
					name: name,
					packing_barcode_unit_of_measurement: packingBarcodeUnitOfMeasurement,
					packing_barcode: packingBarcode,
					pieces_in_bulk: piecesInBulk,
					point_system_tag_id: pointSystemTagId || undefined,
					price_per_bulk: pricePerBulk,
					price_per_piece: pricePerPiece,
					print_details: printDetails,
					product_category: productCategory,
					reorder_point: reorderPoint,
					selling_barcode_unit_of_measurement: sellingBarcodeUnitOfMeasurement,
					selling_barcode: sellingBarcode,
					textcode: textcode,
					type: type,
					unit_of_measurement: unitOfMeasurement,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useProducts');
			},
		},
	);
};

export const useProductEdit = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({
			id,
			actingUserId,
			allowableSpoilage,
			barcode,
			costPerBulk,
			costPerPiece,
			description,
			hasQuantityAllowance,
			isShownInScaleList,
			isVatExempted,
			maxBalance,
			name,
			packingBarcode,
			packingBarcodeUnitOfMeasurement,
			piecesInBulk,
			pointSystemTagId,
			pricePerBulk,
			pricePerPiece,
			printDetails,
			productCategory,
			reorderPoint,
			sellingBarcode,
			sellingBarcodeUnitOfMeasurement,
			textcode,
			type,
			unitOfMeasurement,
		}: any) =>
			ProductsService.edit(
				id,
				{
					acting_user_id: actingUserId,
					allowable_spoilage: allowableSpoilage,
					barcode: barcode,
					cost_per_bulk: costPerBulk,
					cost_per_piece: costPerPiece,
					description: description,
					has_quantity_allowance: hasQuantityAllowance,
					is_shown_in_scale_list: isShownInScaleList,
					is_vat_exempted: isVatExempted,
					max_balance: maxBalance,
					name: name,
					packing_barcode_unit_of_measurement: packingBarcodeUnitOfMeasurement,
					packing_barcode: packingBarcode,
					pieces_in_bulk: piecesInBulk,
					point_system_tag_id: pointSystemTagId || null,
					price_per_bulk: pricePerBulk,
					price_per_piece: pricePerPiece,
					print_details: printDetails,
					product_category: productCategory,
					reorder_point: reorderPoint,
					selling_barcode_unit_of_measurement: sellingBarcodeUnitOfMeasurement,
					selling_barcode: sellingBarcode,
					textcode: textcode,
					type: type,
					unit_of_measurement: unitOfMeasurement,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useProducts');
			},
		},
	);
};

export const useProductDelete = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, actingUserId }) =>
			ProductsService.delete(
				id,
				{
					acting_user_id: actingUserId,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useProducts');
			},
		},
	);
};

export default useProducts;
