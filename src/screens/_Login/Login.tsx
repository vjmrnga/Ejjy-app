import { Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { Box, Button } from '../../components/elements';
import { IS_APP_LIVE } from '../../global/constants';
import { request } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
import { getKeyDownCombination, getLocalIpAddress } from '../../utils/function';
import { IFormValues, LoginForm } from './components/LoginForm';
import { SettingUrlModal } from './components/SettingUrlModal';
import './style.scss';

const Login = () => {
	// STATES
	const [urlModalVisible, setUrlModalVisible] = useState(false);
	const [isSetupButtonsVisible, setSetupButtonsVisible] = useState(false);

	// CUSTOM HOOKS
	const { login, status, errors } = useAuth();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	useEffect(() => {
		if (!IS_APP_LIVE) {
			setSetupButtonsVisible(!getLocalIpAddress());
		}
	}, []);

	const onSubmit = (data: IFormValues) => {
		login(data);
	};

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (['meta+s', 'ctrl+s'].includes(key) && !IS_APP_LIVE) {
			event.preventDefault();
			setSetupButtonsVisible((value) => !value);
		}
	};

	return (
		<section className="Login">
			<Box className="container">
				<img src={require('../../assets/images/logo.jpg')} alt="logo" className="logo" />

				<LoginForm onSubmit={onSubmit} loading={status === request.REQUESTING} errors={errors} />

				{isSetupButtonsVisible && (
					<>
						<Divider />

						<Button
							type="button"
							text="Set API URL"
							variant="default"
							onClick={() => setUrlModalVisible(true)}
							block
						/>

						<SettingUrlModal visible={urlModalVisible} onClose={() => setUrlModalVisible(false)} />
					</>
				)}
			</Box>
		</section>
	);
};

export default Login;
