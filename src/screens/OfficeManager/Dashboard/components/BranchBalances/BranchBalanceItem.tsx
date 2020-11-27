import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TableNormal } from '../../../../../components';
import { CashieringCard } from '../../../../../components/CashieringCard/CashieringCard';
import { SearchInput } from '../../../../../components/elements';
import { selectors as authSelectors } from '../../../../../ducks/auth';
import { request } from '../../../../../global/types';
import { useBranchesDays } from '../../../../../hooks/useBranchesDays';

const columns = [{ name: 'Barcode' }, { name: 'Name' }, { name: 'Balance' }, { name: 'Status' }];

interface Props {
	dataSource?: any;
	branchId: number;
}

export const BranchBalanceItem = ({ branchId, dataSource }: Props) => {
	const [data, setData] = useState([]);

	const {
		branchDay,
		createBranchDay,
		editBranchDay,
		status: branchesDaysStatus,
		errors: branchesDaysErrors,
	} = useBranchesDays();
	const user = useSelector(authSelectors.selectUser());

	useEffect(() => {
		setData(dataSource);
	}, [dataSource]);

	// Effect: Display errors from branch cashiering
	useEffect(() => {
		if (branchesDaysErrors?.length && branchesDaysStatus === request.ERROR) {
			message.error(branchesDaysErrors);
		}
	}, [branchesDaysErrors, branchesDaysStatus]);

	const onStartDay = () => {
		createBranchDay(branchId, user.id);
	};

	const onEndDay = () => {
		editBranchDay(branchDay.id, user.id);
	};

	const onSearch = (keyword) => {
		keyword = keyword?.toLowerCase();

		const filteredData =
			keyword.length > 0
				? dataSource.filter((item) => {
						const barcode = item?.[0]?.barcode?.toLowerCase() || '';
						const textcode = item?.[0]?.textcode?.toLowerCase() || '';
						const name = item?.[0]?.name?.toLowerCase() || '';

						return (
							name.includes(keyword) || barcode.includes(keyword) || textcode.includes(keyword)
						);
				  })
				: dataSource;

		setData(filteredData);
	};

	return (
		<>
			<CashieringCard
				classNames="bordered cashiering-card-office"
				branchDay={branchDay}
				onClick={branchDay ? onEndDay : onStartDay}
				loading={branchesDaysStatus === request.REQUESTING}
			/>

			<SearchInput
				classNames="tab-search-input"
				placeholder="Search product"
				onChange={(event) => onSearch(event.target.value.trim())}
			/>
			<TableNormal columns={columns} data={data} />
		</>
	);
};
