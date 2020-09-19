import cn from 'classnames';
import { debounce } from 'lodash';
import React, { useCallback } from 'react';
import { AddIcon } from '../..';
import { Button, SearchInput, Select } from '../../elements';
import { Option } from '../../elements/Select/Select';
import './style.scss';

const SEARCH_DEBOUNCE_TIME = 250; // 250ms

interface Props {
	title?: string;
	searchPlaceholder?: string;
	buttonName?: string;
	statuses?: Option[];
	onCreateDisabled?: boolean;
	onCreateTooltip?: string;
	onStatusSelect?: any;
	onSearch?: any;
	onCreate?: any;
}

export const TableHeader = ({
	title,
	searchPlaceholder,
	buttonName,
	onStatusSelect,
	statuses,
	onCreateDisabled,
	onCreateTooltip,
	onSearch,
	onCreate,
}: Props) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounceSearchedChange = useCallback(
		debounce((keyword) => onSearch(keyword), SEARCH_DEBOUNCE_TIME),
		[onSearch],
	);

	return (
		<div className="TableHeader">
			{title && <p className="title">{title}</p>}
			<div
				className={cn('controls', {
					'no-title': !title,
					'only-button': !title && !onSearch,
				})}
			>
				{onSearch && (
					<SearchInput
						classNames="search-input"
						placeholder={searchPlaceholder}
						onChange={(event) => debounceSearchedChange(event.target.value.trim())}
					/>
				)}

				{onStatusSelect && (
					<Select
						classNames="status-select"
						options={statuses}
						placeholder="status"
						onChange={onStatusSelect}
					/>
				)}

				{onCreate && (
					<Button
						text={buttonName}
						variant="primary"
						onClick={onCreate}
						iconDirection="left"
						icon={<AddIcon />}
						disabled={onCreateDisabled}
						tooltip={onCreateTooltip}
					/>
				)}
			</div>
		</div>
	);
};

TableHeader.defaultProps = {
	title: null,
	onSearch: null,
	onCreate: null,
	searchPlaceholder: 'Search',
};
