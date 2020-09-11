import cn from 'classnames';
import { debounce } from 'lodash';
import React, { useCallback } from 'react';
import { AddIcon } from '../..';
import { Button, SearchInput, StatusSelect } from '../../elements';
import { Option } from '../../elements/StatusSelect/StatusSelect';
import './style.scss';

const SEARCH_DEBOUNCE_TIME = 250; // 250ms

interface Props {
	title?: string;
	searchPlaceholder?: string;
	buttonName?: string;
	statuses?: Option[];
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
						placeholder={searchPlaceholder}
						onChange={(event) => debounceSearchedChange(event.target.value.trim())}
					/>
				)}

				{onStatusSelect && (
					<StatusSelect
						options={statuses}
						placeholder="status"
						onSelect={(event) => onStatusSelect(event.target.value)}
					/>
				)}

				{onCreate && (
					<Button
						text={buttonName}
						variant="primary"
						onClick={onCreate}
						iconDirection="left"
						icon={<AddIcon />}
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
