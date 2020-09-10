import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Box } from '../../components/elements';
import { actions } from '../../ducks/auth';
import { request } from '../../global/variables';
import { IFormValues, LoginForm } from './components/LoginForm';
import { useLogin } from './hooks/useLogin';
import './style.scss';

type ILoginProps = ConnectedProps<typeof connector>;

const Login = ({ loginDispatch }: ILoginProps) => {
	const [login, loginStatus, loginErrors] = useLogin(loginDispatch);

	const onSubmit = (data: IFormValues) => {
		login(data);
	};

	return (
		<section className="Login">
			<Box className="container">
				<img src={require('../../assets/images/logo.jpg')} alt="logo" className="logo" />

				<LoginForm
					onSubmit={onSubmit}
					loading={loginStatus === request.REQUESTING}
					errors={loginErrors}
				/>
			</Box>
		</section>
	);
};

const mapDispatch = (dispatch: any) => ({
	...bindActionCreators({ loginDispatch: actions.login }, dispatch),
});

const connector = connect(null, mapDispatch);

export default connector(Login);
