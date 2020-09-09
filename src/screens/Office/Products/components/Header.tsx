import { debounce } from 'lodash';
import React, { useCallback } from 'react';
import { Button, SearchInput } from '../../../../components/elements';

const SEARCH_DEBOUNCE_TIME = 250; // 250ms

interface Props {
	onSearchChange: any;
	onCreateProduct: any;
}

export const Header = ({ onSearchChange, onCreateProduct }: Props) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounceSearchedChange = useCallback(
		debounce((keyword) => onSearchChange(keyword), SEARCH_DEBOUNCE_TIME),
		[onSearchChange],
	);

	return (
		<div className="header">
			<SearchInput
				placeholder="Search Product"
				onChange={(event) => debounceSearchedChange(event.target.value.trim())}
			/>
			<Button
				text="Create Product"
				variant="primary"
				onClick={onCreateProduct}
				iconDirection="left"
				icon={
					<img
						src={require('../../../../assets/images/icon-add-white.svg')}
						className="icon"
						alt="icon"
					/>
				}
			/>
		</div>
	);
};
