import React, { Component } from 'react';
import './Home.css';
import axios from 'axios';
import { Container, Row, Col, Button } from 'reactstrap';

import ConversationList from '../../components/ConversationList';
import ContentChat from "../../components/ContentChat";
import DialogNewConversation from "../../components/DialogNewConversation";

import { socket_key } from '../../../core/constants';
import { socket } from '../../../core/socket_connect';
import { url_api, url_client } from '../../../core/constants';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faComment } from '@fortawesome/free-solid-svg-icons';

library.add(faComment);

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
		if(localStorage.Auth){
			const auth = JSON.parse(localStorage.Auth);
			socket.emit(socket_key.ENTER_USER, auth.user._id);
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

        socket.on(socket_key.NEW_CONVERSATION, (conversation) => {
            console.log('new conversation client: ', conversation);
            axios.get(url_api + '/api/chat/', { 
                headers : {
                    "x-access-token": JSON.parse(localStorage.Auth).token
                }
            }).then((res) => {
                this.setState({ data: res.data });
            })
        })
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
                console.log('res--- ', res);
                if(this.props.match.params === undefined || Object.keys(this.props.match.params).length === 0) {
                    window.location.href = url_client + '/t/' + res.data.conversations[0].new_message.conversationId;
                }
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
            }).catch((err) => {
                if(err.response !== undefined && err.response.status === 403) {
                    const auth = JSON.parse(localStorage.Auth);
                    let data = {
                        email: auth.user.email
                    }
                    axios.post(url_api + '/api/auth/reconnect/__user=' + auth.user._id, data).then((res) => {
                        localStorage.setItem('Auth', JSON.stringify(res.data));
                        window.location.reload();
                    })
                }
            })
        }
    }

    componentDidMount = () => {
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll = (event) => {
        // let scrollTop = event.srcElement.body.scrollTop;
        // let itemTranslate = Math.min(0, scrollTop/3 - 60);
    
        // this.setState({
        //     transform: itemTranslate
        // });
    }

    handleChange = (e) => {
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
        const valueChecked = this.state.valueChecked;
        let data = {
            composedMessage: document.getElementById('textMessage').value,
            recipient: valueChecked
        }

        axios.post(url_api + '/api/chat/new/' , data,
        {
            headers : {
                "x-access-token": JSON.parse(localStorage.Auth).token
            }
        }).then((res) => {
            if(res.status === 200) {
                valueChecked.map((item, key) => {
                    console.log('emit new conversation: ', item);
                    return socket.emit(socket_key.NEW_CONVERSATION, res.data.conversationId, item);
                })
                
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

    handleViewMessage = (val) => {
        console.log(val);
        const auth = JSON.parse(localStorage.Auth);
        let data = {
            message_id: val,
            user_id: auth.user._id
        }
        axios.post(url_api + '/api/chat/m/view', data, {
            headers : {
                "x-access-token": auth.token
            }
        }).then((res) => {
            axios.get(url_api + '/api/chat/', { 
                headers : {
                    "x-access-token": JSON.parse(localStorage.Auth).token
                }
            }).then((res) => {
                this.setState({ data: res.data });
            })
        })
    }

    render() {
        const conversationsList = this.state.data.conversations;
        const conversation = this.state.conversation;
        const composedMessage = this.state.composedMessage;
        console.log(this.state.valueChecked);
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
                            <div aria-label="Danh sách cuộc trò chuyện" role="grid">
                                {(conversationsList !== undefined && conversationsList.length > 0) ? conversationsList.map((item, key) => {
                                    return (
                                        <ConversationList 
                                            key={key} 
                                            conversation={item} 
                                            refreshConversationList={this.refreshConversationList}
                                        />
                                    )
                                }) : ''}
                                
                            </div>
                        </div>
                    </Col>
                    <Col className="center-messenger">
                        <ContentChat 
                            conversationsList={conversationsList} 
                            conversation={conversation} 
                            composedMessage={composedMessage}
                            handleSubmit={this.handleSubmit}
                            handleChange={this.handleChange}
                            handleLogout={this.handleLogout}
                            handleClearPlaceholder={this.handleClearPlaceholder}
                            isTyping={isTyping}
                            textTyping={text}
                            handleViewMessage={this.handleViewMessage}
                        />
                    </Col>
                    <DialogNewConversation
                        modal={this.state.modal}
                        placeholderString={this.state.placeholderString}
                        handleChangeCheckbox={this.handleChangeCheckbox}
                        toggle={this.toggle}
                        handleNewConversation={this.handleNewConversation}
                    />
                </Row>
            </Container>
        );
    }
}

export default Home;
