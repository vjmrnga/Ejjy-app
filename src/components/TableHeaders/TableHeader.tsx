import { debounce } from 'lodash';
import React, { useCallback } from 'react';
import { Button, SearchInput } from '../elements';
import { AddIcon } from '../Icons/Icons';
import './style.scss';
import cn from 'classnames';

const SEARCH_DEBOUNCE_TIME = 250; // 250ms

interface Props {
	title?: string;
	searchPlaceholder?: string;
	buttonName: string;
	onSearch?: any;
	onCreate: any;
}

export const TableHeader = ({
	title,
	searchPlaceholder,
	buttonName,
	onSearch,
	onCreate,
}: Props) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounceSearchedChange = useCallback(
		debounce((keyword) => onSearch(keyword), SEARCH_DEBOUNCE_TIME),
		[onSearch],
	);

	return (
		<div
			className={cn('TableHeader', {
				'only-button': !title && !onSearch,
			})}
		>
			{title && <p className="title">{title}</p>}
			<div className="controls">
				{onSearch && (
					<SearchInput
						placeholder={searchPlaceholder}
						onChange={(event) => debounceSearchedChange(event.target.value.trim())}
					/>
				)}

				<Button
					text={buttonName}
					variant="primary"
					onClick={onCreate}
					iconDirection="left"
					icon={<AddIcon />}
				/>
			</div>
		</div>
	);
};

TableHeader.defaultProps = {
	title: null,
	onSearch: null,
	searchPlaceholder: 'Search',
};
