import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './Home.css';
import axios from 'axios';
import io from 'socket.io-client';
import { Container, Row, Col, Button, Input, Form, Alert } from 'reactstrap';

import MessageList from './MessageList';

import { socket_key } from '../../../core/constants';


const server = 'http://localhost'
// const server = 'http://192.168.11.113'
const port_client = 5002;
const port_api = 5000;
const url_client = server + ':' + port_client;
const url_api = server + ':' + port_api;

const socket = io.connect(url_api);

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            composedMessage: {
                value: 'Nhập tin nhắn...',
                isEnter: false
            },
            conversation: []
        }

        if(this.props.match.params) {
            const conversationId = this.props.match.params.conversationId;
            socket.emit(socket_key.ENTER_CONVERSATION, conversationId);
        }
        
        socket.on(socket_key.REFRESH_MESSAGES, (data) => {
            console.log('refresh messages constructor:', data);
            if(this.props.match.params) {
                const conversationId = this.props.match.params.conversationId;
                if(conversationId) {
                    axios.get(url_api + '/api/chat/' + conversationId, {
                        headers : {
                            "x-access-token": JSON.parse(localStorage.Auth).token
                        }
                    }).then((res) => {
                        this.setState({
                            conversation: res.data.conversation
                        })
                    })
                }
            }
        });
    }

    // async getData() {
    //     const res =  await axios.get('http://localhost:5000/api/chat/', { 
    //         headers : {
    //             "x-access-token": JSON.parse(localStorage.Auth).token
    //         }
    //     });
    //     return await res;
    // }

    async componentWillMount() {
        if(!localStorage.Auth) {
            window.location.href = url_client + '/login';
        } else {

            // await this.getData().then((res) => {
            //     console.log('res.data', res);
            //     this.setState({ data: res.data});
            // })

            axios.get(url_api + '/api/chat/', { 
                headers : {
                    "x-access-token": JSON.parse(localStorage.Auth).token
                }
            }).then((res) => {
                this.setState({ data: res.data });
                
                if(this.props.match.params) {
                    const conversationId = this.props.match.params.conversationId;
                    if(conversationId) {
                        axios.get(url_api + '/api/chat/' + conversationId, {
                            headers : {
                                "x-access-token": JSON.parse(localStorage.Auth).token
                            }
                        }).then((res) => {
                            this.setState({
                                conversation: res.data.conversation
                            })
                        })
                    }
                }
            });
        }
    }

    componentDidMount = () => {
        if(this.props.match.params) {
            console.log('scrollIntoView');
            var n = this.state.conversation.length;
            var objDiv = document.getElementById(n.toString());
            // this.refs[30].scrollIntoView();
        }
    }

    handleChange = (e) => {
        this.setState({
            composedMessage: e.target.value
        })
    }

    handleSubmit = (e) => {
        console.log('submit');
        e.preventDefault();
        if(this.props.match.params) {
            const conversationId = this.props.match.params.conversationId;
            axios.post(url_api + '/api/chat/' + conversationId, {
                composedMessage: this.state.composedMessage.value
            } ,{
                headers : {
                    "x-access-token": JSON.parse(localStorage.Auth).token
                }
            }).then((res) => {
                if(res.status === 200) {
                    console.log('status-200OK');
                    socket.emit(socket_key.NEW_MESSAGE, conversationId);
                    this.setState({
                        composedMessage: {
                            value: 'Nhập tin nhắn...'
                        }
                    })
                }
            })
            
        }

    }

    handleLogout = (e) => {
        console.log('handleLogout');
        localStorage.removeItem('Auth');
        window.location.href = url_client + '/login';
    }

    handleClearPlaceholder = () => {
        this.setState({
            composedMessage: {
                value: ''
            }
        })
    }

    render() {
        const conversations = this.state.data.conversations;
        const conversation = this.state.conversation;
        const composedMessage = this.state.composedMessage;
        if(conversations === undefined || conversation === []) {
            return (
                <Container>
                    <Row>
                    </Row>
                </Container>
            );      
        }

        const domenode = ReactDOM.findDOMNode(this.re)

        if(conversations !== undefined && conversations.length > 0) {
            return (
                <Container>
                    <Row>
                        <Col sm="3" md="3" className="left-messenger">
                            <div className="banner-messenger" role="banner">
                                <h1 className="title">Messenger</h1>
                            </div>
                            <div className="list-user-chat">
                                <ul aria-label="Danh sách cuộc trò chuyện" role="grid">
                                    {conversations.map((item, key) => {
                                        return (
                                            <MessageList key={key} conversation={item} />
                                        )
                                    })}
                                    
                                </ul>
                            </div>
                        </Col>
                        <Col className="center-messenger">
                            <div className="banner-message-author" role="banner">
                                <h1 className="title">{JSON.parse(localStorage.Auth).user.first_name + " " + JSON.parse(localStorage.Auth).user.last_name}</h1>
                                <Button onClick={this.handleLogout} className="logout">Đăng xuất</Button>
                            </div>
                            <div className="content-message">
                                <Form onSubmit={this.handleSubmit}>
                                    <div aria-label="Tin nhắn" className="message" role="region">
                                    {conversation.map((item, key) => {
                                        const first_name = item.author.profile.first_name;
                                        const last_name = item.author.profile.last_name;
                                        const message = item.body;
                                        let main_class = '';
                                        let color = 'success';
                                        if(item.author._id === JSON.parse(localStorage.Auth).user._id) {
                                            main_class = 'main-user';
                                            color = 'primary';
                                        }
                                        return (
                                            <Alert key={key} id={key+1} ref={key} color={color} className={item._id}>
                                                {first_name + " " + last_name + " : " + message}
                                            </Alert>
                                        );
                                    })}
                                    <Alert ref={30} className="dasd5asdsad7asd667d67ad5as">
                                        {'sdaasdasdasdas'}
                                    </Alert>
                                    </div>
                                    <Col sm="12" md="12" aria-label="Tin nhắn mới" className="new-message" role="region">
                                        <div className="form-new-message">
                                            <Col sm="10" md="10">
                                                <Input type="text" 
                                                    onKeyDown={this.handleClearPlaceholder}
                                                    //onClick={this.handleClearPlaceholder}
                                                    onChange={this.handleChange} 
                                                    name="new-message" 
                                                    id="new-message" 
                                                    value={composedMessage.value} 
                                                />
                                            </Col>
                                            <Col sm="2" md="2">
                                                <Button onSubmit={this.handleSubmit} color="primary" className="btn-send-message">Gửi</Button>
                                            </Col>
                                        </div>
                                    </Col>
                                </Form>
                            </div>
                        </Col>
                        {/* <Col sm="3" md="3" className="right-messenger">asasd</Col> */}
                    </Row>
                </Container>
                
            );
        }
        
    }
}

export default Home;
