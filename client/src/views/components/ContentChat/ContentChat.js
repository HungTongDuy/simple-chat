import React from 'react';
import { Col, Button, Input, Form, Alert } from 'reactstrap';
import scrollIntoView from 'scroll-into-view-if-needed';

class ContentChat extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidUpdate() {
        //this.wrap.scrollIntoView({ behavior: "smooth" });
        const conversation = this.props.conversation;
        if(Object.keys(conversation).length > 0) {
            const messages = conversation.messages;
            const id = "m_" + messages.length;
            scrollIntoView(document.getElementById(id))
        }
    }

    render() {
        const conversations_list = this.props.conversationsList;
        const conversation = this.props.conversation;
        const composedMessage = this.props.composedMessage;
        const participants = conversation.participants;
        const messages = conversation.messages;
        console.log('conversations_list', conversations_list);
        let title_conversation = '';
        if(Object.keys(conversation).length > 0) {
            participants.map((item, key) => {
                let full_name = item.profile.first_name + ' ' + item.profile.last_name;
                if(key + 1 !== participants.length) {
                    return title_conversation = title_conversation + full_name + ', ';
                } else {
                    return title_conversation = title_conversation + full_name;
                }
            })
        }

        return (
            <div>
                <div className="banner-message-author" role="banner">
                    <h1 className="title">{title_conversation}</h1>
                    <Button onClick={this.props.handleLogout} className="logout">Đăng xuất</Button>
                </div>
                <div className="content-message">
                    <Form onSubmit={this.props.handleSubmit}>
                        <div aria-label="Tin nhắn" className="message" role="region">
                        {(conversations_list !== undefined && Object.keys(conversation).length > 0) ? messages.map((item, key) => {
                            const first_name = item.author.profile.first_name;
                            const last_name = item.author.profile.last_name;
                            let full_name = first_name + " " + last_name + " : "; 
                            const message = item.body;
                            let main_class = 'other-user';
                            let color = 'success';
                            if(item.author._id === JSON.parse(localStorage.Auth).user._id) {
                                main_class = 'main-user';
                                color = 'primary';
                                full_name = '';
                            }
                            return (
                                <div className="message-row" key={key}>
                                    <Alert id={"m_" + (key + 1)} color={color} className={main_class + " message-item"}>
                                        { full_name + message}
                                    </Alert>
                                </div>
                            );
                        }) : ''}
                        </div>
                        <Col sm="12" md="12" aria-label="Tin nhắn mới" className="new-message" role="region">
                            {this.props.isTyping ? <span className="typing-text">{this.props.textTyping}</span> : ''}
                            <div className="form-new-message">
                                <Col sm="10" md="10">
                                    <Input type="text" 
                                        onKeyDown={this.props.handleClearPlaceholder}
                                        onClick={this.props.handleClearPlaceholder}
                                        onChange={this.props.handleChange} 
                                        name="new-message" 
                                        id="new-message" 
                                        value={composedMessage.value}
                                    />
                                </Col>
                                <Col sm="2" md="2">
                                    <Button onSubmit={this.props.handleSubmit} color="primary" className="btn-send-message">Gửi</Button>
                                </Col>
                            </div>
                        </Col>
                    </Form>
                </div>
            </div>
        )
    }
}

export default ContentChat;