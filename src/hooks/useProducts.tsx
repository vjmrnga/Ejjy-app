import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ProductsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl, isStandAlone } from 'utils';

const useProducts = ({ params }: Query) =>
	useQuery<any>(
		[
			'useProducts',
			params?.branchId,
			params?.ids,
			params?.page,
			params?.pageSize,
			params?.productCategory,
			params?.search,
		],
		async () => {
			const service = isStandAlone()
				? ProductsService.list
				: ProductsService.listOffline;

			return service(
				{
					branch_id: params?.branchId,
					ids: params?.ids,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					page: params?.page || DEFAULT_PAGE,
					product_category: params?.productCategory,
					search: params?.search,
				},
				getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors));
		},
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
			conversionAmount,
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
			priceTagPrintDetails,
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
					barcode,
					conversion_amount: conversionAmount,
					cost_per_bulk: costPerBulk,
					cost_per_piece: costPerPiece,
					description,
					has_quantity_allowance: hasQuantityAllowance,
					is_shown_in_scale_list: isShownInScaleList,
					is_vat_exempted: isVatExempted,
					max_balance: maxBalance,
					name,
					packing_barcode_unit_of_measurement: packingBarcodeUnitOfMeasurement,
					packing_barcode: packingBarcode,
					pieces_in_bulk: piecesInBulk,
					point_system_tag_id: pointSystemTagId || undefined,
					price_per_bulk: pricePerBulk,
					price_per_piece: pricePerPiece,
					print_details: printDetails,
					price_tag_print_details: priceTagPrintDetails,
					product_category: productCategory,
					reorder_point: reorderPoint,
					selling_barcode_unit_of_measurement: sellingBarcodeUnitOfMeasurement,
					selling_barcode: sellingBarcode,
					textcode,
					type,
					unit_of_measurement: unitOfMeasurement,
				},
				getOnlineApiUrl(),
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
			conversionAmount,
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
			priceTagPrintDetails,
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
					barcode: barcode || null,
					conversion_amount: conversionAmount,
					cost_per_bulk: costPerBulk,
					cost_per_piece: costPerPiece,
					description,
					has_quantity_allowance: hasQuantityAllowance,
					is_shown_in_scale_list: isShownInScaleList,
					is_vat_exempted: isVatExempted,
					max_balance: maxBalance,
					name,
					packing_barcode_unit_of_measurement: packingBarcodeUnitOfMeasurement,
					packing_barcode: packingBarcode || null,
					pieces_in_bulk: piecesInBulk,
					point_system_tag_id: pointSystemTagId || null,
					price_per_bulk: pricePerBulk,
					price_per_piece: pricePerPiece,
					print_details: printDetails,
					price_tag_print_details: priceTagPrintDetails,
					product_category: productCategory,
					reorder_point: reorderPoint,
					selling_barcode_unit_of_measurement: sellingBarcodeUnitOfMeasurement,
					selling_barcode: sellingBarcode || null,
					textcode,
					type,
					unit_of_measurement: unitOfMeasurement,
				},
				getOnlineApiUrl(),
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
				{ acting_user_id: actingUserId },
				getOnlineApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useProducts');
			},
		},
	);
};

export default useProducts;
