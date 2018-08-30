import React from 'react';
import axios from 'axios';
import { Container, Row, Button, FormGroup, Label, Input, Form } from 'reactstrap';
import './Login.css';

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
            window.location.href = 'http://localhost:5002';
        }
    }

    login = (e) => {
        e.preventDefault();
        let data = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post('http://localhost:5000/api/auth/login/', data).then((res) => {
            localStorage.setItem('Auth', JSON.stringify(res.data));
            window.location.href = 'http://localhost:5002';
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
                            <Button>Tiếp tục</Button>
                        </Form>
                    </div>
                </Row>
            </Container>
        )
    }
}

export default Login;