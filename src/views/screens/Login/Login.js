import React from 'react';
import axios from 'axios';
import { Container, Row, Button, FormGroup, Input, Form } from 'reactstrap';
import './Login.css';

import { url_api, url_client } from '../../../core/constants';

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            email:  '',
            password: ''
        }
    }

    componentWillMount() {
        if(localStorage.Auth) {
            window.location.href = url_client;
        }
    }

    login = (e) => {
        e.preventDefault();
        let data = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post(url_api + '/api/auth/login/', data).then((res) => {
            localStorage.setItem('Auth', JSON.stringify(res.data));
            window.location.href = url_client;
        })
    }

    handleChange = (e, name) => {
        console.log(e.target.value);
        this.setState({
            [name]: e.target.value
        })
    }

    render() {
        console.log('state: ', this.state);
        console.log('localStorage: ', localStorage.Auth);
        return (
            <Container>
                <Row>
                    <div className="login-form">
                        <h1 className="title">Messenger</h1>
                        <Form onSubmit={this.login}>
                            <FormGroup>
                                <Input type="email" onChange={(e) => this.handleChange(e, 'email')} name="email" id="email" placeholder="Email hoặc số điện thoại" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="password" onChange={(e) => this.handleChange(e, 'password')} name="password" id="password" placeholder="Mật khẩu" />
                            </FormGroup>
                            <Button className="btn-login">Tiếp tục</Button>
                            <div className="clearfix"></div>
                            <a className="register-link" href={url_client + "/register"}>Đăng ký tài khoản</a>
                        </Form>
                    </div>
                </Row>
            </Container>
        )
    }
}

export default Login;