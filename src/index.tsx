import { ConfigProvider } from 'antd';
import { ConnectedRouter } from 'connected-react-router';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from 'dayjs/plugin/isToday';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import configureAxios from './configureAxios';
import configurePrinter from './configurePrinter';
import configureStore from './configureStore';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import history from './utils/history';

// Configure timezone
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.tz.setDefault('Asia/Manila');

// Start Interceptor
const store = configureStore({}, history);
configureAxios();
configurePrinter();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
});

ConfigProvider.config({
	theme: {
		primaryColor: '#20bf6b',
		errorColor: '#fc5c65',
	},
});

ReactDOM.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistStore(store)}>
					<ConnectedRouter history={history}>
						<App />
					</ConnectedRouter>
				</PersistGate>
			</Provider>
		</QueryClientProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
