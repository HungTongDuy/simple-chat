import React from 'react';
import axios from 'axios';
import { Container, Row, Button, FormGroup, Input, Form, Alert } from 'reactstrap';
import './Register.css';

const server = 'http://localhost'
// const server = 'http://192.168.11.113'
const port_client = 5002;
const port_api = 5000;
const url_client = server + ':' + port_client;
const url_api = server + ':' + port_api;

class Register extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            email:  null,
            first_name: null,
            last_name: null,
            password: null,
            isAlert: null,
            messageAlert: null,
            variant: null
        }
    }

    componentWillMount() {
        if(localStorage.Auth) {
            window.location.href = url_client;
        }
    }

    register = (e) => {
        e.preventDefault();
        let data = {
            email: this.state.email,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            password: this.state.password
        }
        axios.post(url_api + '/api/auth/register/', data).then((res) => {
            localStorage.setItem('Auth', JSON.stringify(res.data));
            window.location.href = url_client;
        }).catch((err) => {
            if(err.response.status === 422) {
                console.log(err.response);
                let messageAlert = err.response.data.error
                this.setState({
                    isAlert: true,
                    variant: 'danger',
                    messageAlert: messageAlert
                })
            }
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
        const messageAlert = this.state.messageAlert;
        return (
            <Container>
                <Row>
                    <div className="login-form">
                        <h1 className="title">Messenger</h1>
                        <Form onSubmit={this.register}>
                            <FormGroup>
                                <Input type="email" onChange={(e) => this.handleChange(e, 'email')} name="email" id="email" placeholder="Email hoặc số điện thoại" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="text" onChange={(e) => this.handleChange(e, 'first_name')} name="first_name" id="first_name" placeholder="Tên" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="text" onChange={(e) => this.handleChange(e, 'last_name')} name="last_name" id="last_name" placeholder="Họ" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="password" onChange={(e) => this.handleChange(e, 'password')} name="password" id="password" placeholder="Mật khẩu" />
                            </FormGroup>
                            <Button className="btn-login">Tiếp tục</Button>
                            {!this.state.isAlert ? '' : 
                            <Alert color="danger">
                                {messageAlert}
                            </Alert> }
                        </Form>
                    </div>
                </Row>
            </Container>
        )
    }
}

export default Register;