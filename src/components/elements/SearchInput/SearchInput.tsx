import { SearchOutlined } from '@ant-design/icons';
import * as React from 'react';
import './style.scss';

interface Props {
	placeholder?: string;
	onChange: any;
}

const SearchInput = ({ onChange, placeholder }: Props) => (
	<div className="SearchInput">
		<SearchOutlined className="icon" />
		<input onChange={onChange} placeholder={placeholder} />
	</div>
);

export default SearchInput;
