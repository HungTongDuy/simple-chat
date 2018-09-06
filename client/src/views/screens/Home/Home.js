import React, { Component } from 'react';
import './Home.css';
import axios from 'axios';
import io from 'socket.io-client';
import { CustomInput, Container, Row, Col, Button, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import ConversationList from '../../components/ConversationList';
import ContentChat from "../../components/ContentChat";

import { socket_key } from '../../../core/constants';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faComment } from '@fortawesome/free-solid-svg-icons';

library.add(faComment);


const server = 'http://localhost'
// const server = 'http://192.168.11.113'
const port_client = 5002;
const port_api = 5000;
const url_client = server + ':' + port_client;
const url_api = server + ':' + port_api;

const socket = io.connect(url_api);

const placeholderString = 'Nhập tin nhắn...';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            composedMessage: {
                value: placeholderString,
                isEnter: false
            },
            message: '',
            conversation: [],
            transform: '',
            modal: false,
            value: '',
            valueChecked: []
        }

        if(this.props.match.params) {
            const conversationId = this.props.match.params.conversationId;
            socket.emit(socket_key.ENTER_CONVERSATION, conversationId);
        }
        
        socket.on(socket_key.REFRESH_MESSAGES, (data) => {
            console.log('refresh messages constructor:', data);
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
            })
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
        window.removeEventListener('scroll', this.handleScroll);
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
                console.log('res--- ', res)
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
                //console.log('Error-response: ', err.response)
            }).catch((err) => {
                console.log('Error: ', err.response);
                if(err.response !== undefined && err.response.status === 403) {
                    //localStorage.removeItem('Auth');
                    // window.location.href = url_client + '/login';
                    const auth = JSON.parse(localStorage.Auth);
                    let data = {
                        email: auth.user.email
                    }
                    axios.post('http://localhost:5000/api/auth/reconnect/__user=' + auth.user._id, data).then((res) => {
                        localStorage.setItem('Auth', JSON.stringify(res.data));
                        window.location.reload();
                    })
                }
            })
        }
    }

    componentDidMount = () => {
        window.addEventListener('scroll', this.handleScroll);
        if(this.props.match.params) {
            console.log('scrollIntoView');
            var n = this.state.conversation.length;
            var objDiv = document.getElementById(n.toString());
            // this.refs[30].scrollIntoView();
        }
    }

    handleScroll = (event) => {
        // let scrollTop = event.srcElement.body.scrollTop;
        // let itemTranslate = Math.min(0, scrollTop/3 - 60);
    
        // this.setState({
        //     transform: itemTranslate
        // });
    }

    handleChange = (e) => {
        console.log(e.target.value);
        if(this.props.match.params) {
            const conversationId = this.props.match.params.conversationId;
            const auth =  JSON.parse(localStorage.Auth);
            const full_name = auth.user.first_name + ' ' + auth.user.last_name;
            socket.emit(socket_key.TYPING, conversationId, full_name);
        }
        this.setState({
            message: e.target.value,
            composedMessage: {
                value: e.target.value
            }
        })
    }

    handleSubmit = (e) => {
        console.log('submit');
        e.preventDefault();
        if(this.props.match.params) {
            const conversationId = this.props.match.params.conversationId;
            axios.post(url_api + '/api/chat/rep/' + conversationId, {
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
                            value: placeholderString
                        }
                    })
                }
            })
        }
    }

    handleLogout = (e) => {
        localStorage.removeItem('Auth');
        window.location.href = url_client + '/login';
    }

    handleClearPlaceholder = (e) => {
        console.log('placeholder: ', e.target.value)
        if(e.target.value === placeholderString) {
            this.setState({
                composedMessage: {
                    value: ''
                }
            })
        }
        return false;
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleChangeCheckbox = (e) => {
        if(e.target.checked === true) {
            var valueChecked = this.state.valueChecked;
            valueChecked.push(e.target.value);
            this.setState({
                valueChecked: valueChecked
            })
        } else {
            let valueChecked = this.state.valueChecked;
            var index = valueChecked.indexOf(e.target.value);
            if(index !== -1) valueChecked.splice(index,1);
            this.setState({
                valueChecked: valueChecked
            })
        }
    }

    handleNewConversation = () => {
        let data = {
            composedMessage: document.getElementById('textMessage').value,
            recipient: this.state.valueChecked
        }

        axios.post(url_api + '/api/chat/new/' , data,
        {
            headers : {
                "x-access-token": JSON.parse(localStorage.Auth).token
            }
        }).then((res) => {
            if(res.status === 200) {
                console.log('status-200OK');
                socket.emit(socket_key.NEW_MESSAGE, res.data.conversationId);
                window.location.href = url_client + '/t/' + res.data.conversationId;
            }
        })
    }

    refreshConversationList = (data) => {
        axios.get(url_api + '/api/chat/', { 
            headers : {
                "x-access-token": JSON.parse(localStorage.Auth).token
            }
        }).then((res) => {
            this.setState({ data: res.data });
        })
    }

    render() {
        const conversationsList = this.state.data.conversations;
        const conversation = this.state.conversation;
        const composedMessage = this.state.composedMessage;
        let isTyping = false;
        let text = '';
        socket.on(socket_key.TYPING, (conversation, full_name) => {
            console.log('typing', conversation + ' - ' + full_name);
            isTyping = true;
            text = full_name + ' đang soạn tin nhắn...'
        })
        

        return (
            <Container>
                <Row>
                    <Col sm="3" md="3" className="left-messenger">
                        <div className="banner-messenger" role="banner">
                            <h1 className="title">Messenger</h1>
                                {/* <FontAwesomeIcon icon="comment-alt-plus" /> */}
                            <Button className="new-conversation" onClick={this.toggle}>Tin nhắn mới</Button>
                        </div>
                        <div className="list-user-chat">
                            <ul aria-label="Danh sách cuộc trò chuyện" role="grid">
                                {(conversationsList !== undefined && conversationsList.length > 0) ? conversationsList.map((item, key) => {
                                    return (
                                        <ConversationList 
                                            key={key} 
                                            conversation={item} 
                                            refreshConversationList={this.refreshConversationList}
                                        />
                                    )
                                }) : ''}
                                
                            </ul>
                        </div>
                    </Col>
                    <Col className="center-messenger">
                        <ContentChat 
                            conversationsList={conversationsList} 
                            conversation={conversation} 
                            composedMessage={composedMessage}
                            handleSubmit={this.handleSubmit}
                            handleChange={this.handleChange}
                            handleClearPlaceholder={this.handleClearPlaceholder}
                            isTyping={isTyping}
                            textTyping={text}
                        />
                    </Col>
                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>Tạo mới cuộc trò chuyện</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="exampleEmail">Chọn bạn để trò chuyện</Label>
                                <CustomInput onChange={this.handleChangeCheckbox} type="checkbox" id="5b867a36b290193c94ee24fa" value="5b867a36b290193c94ee24fa" label="Hung Tong" />
                                <CustomInput onChange={this.handleChangeCheckbox} type="checkbox" id="5b868e533f19a23b1c4e4997" value="5b868e533f19a23b1c4e4997" label="User 1" />
                                <CustomInput onChange={this.handleChangeCheckbox} type="checkbox" id="5b868ec83f19a23b1c4e4998" value="5b868ec83f19a23b1c4e4998" label="User 2" />
                                <CustomInput onChange={this.handleChangeCheckbox} type="checkbox" id="5b868f8b3355b042301d3039" value="5b868f8b3355b042301d3039" label="User 3" />
                                <CustomInput onChange={this.handleChangeCheckbox} type="checkbox" id="5b8f97b18250bd51c82d4f03" value="5b8f97b18250bd51c82d4f03" label="User 4" />
                            </FormGroup>
                            <FormGroup>
                                <Input type="text" name="textMessage" id="textMessage" placeholder={placeholderString} />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggle}>Hủy</Button>
                            <Button color="primary" onClick={this.handleNewConversation}>Nhắn tin</Button>
                        </ModalFooter>
                    </Modal>
                </Row>
            </Container>
        );
    }
}

export default Home;
