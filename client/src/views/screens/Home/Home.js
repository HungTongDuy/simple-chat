import React, { Component } from 'react';
import logo from './logo.svg';
import './Home.css';
import axios from 'axios';

import { Container, Row, Col, FormGroup, Label, Input, Form } from 'reactstrap';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            message: ''
        }
    }

    componentWillMount() {
        if(!localStorage.Auth) {
            window.location.href = 'http://localhost:5002/login';
        } else {

            axios.get('http://localhost:5000/api/chat/', { 
                headers : {
                    "x-access-token": JSON.parse(localStorage.Auth).token
                }
            }).then((res) => {
                this.setState({ data: res.data})
            });
        }
    }

    handleChange = (e) => {
        this.setState({
            message: e.target.value
        })
    }

    render() {
        console.log('conversations: ', this.state);
        const conversations = this.state.data.conversations;

        if(conversations === undefined) {
            return (
                <Container>
                </Container>
            )
        }

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
                                            <ItemUser key={key} conversation={item} />
                                        )
                                    })}
                                    
                                </ul>
                            </div>
                        </Col>
                        <Col className="center-messenger">
                            <div className="banner-message-author" role="banner">
                                <h1 className="title">Hung Tong</h1>
                            </div>
                            <div className="content-message">
                                <Form>
                                    <div aria-label="Tin nhắn" className="message" role="region"></div>
                                    <div aria-label="Tin nhắn mới" className="new-message" role="region">
                                    <FormGroup>
                                        <Input type="text" onChange={this.handleChange} name="new-message" id="new-message" placeholder="Nhập tin nhắn..." />
                                    </FormGroup>
                                    </div>
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

const ItemUser = (props) => {
    const conversation = props.conversation[0];
    console.log('conversation', conversation);
    return(
        <li className="_5l-3 _1ht1 item-user" role="row" tabIndex="-1">
            <div className="_5l-3 _1ht5 item-user-content" id="row_header_id_user:100002617552652" role="gridcell" tabIndex="-1">
                <a className="_1ht5 _2il3 _5l-3 _3itx item-content" role="link" tabIndex="-1" data-href="https://www.messenger.com/t/tuyet.trinh.9028">
                    <div aria-hidden="true" className="_1qt3 _5l-3 item-avt" data-tooltip-content="Trinh Tống" data-hover="tooltip" data-tooltip-position="right" data-tooltip-alignh="center">
                        <div className="_4ldz user-item">
                            <div className="_4ld- user-item-content">
                                <img src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.0-1/p40x40/28467818_2242555562424955_7492271093481853012_n.jpg?_nc_cat=0&oh=d09044dfcaee1f7f07a948d27b2bef46&oe=5BF122F4" width="50" height="50" alt="" className="img" />
                            </div>
                        </div>
                    </div>
                    <div className="_1qt4 _5l-m item-name">
                        <div className="_1qt5 _5l-3 item-user-name"><span className="_1ht6 user-name">{conversation.author.profile.first_name + " " + conversation.author.profile.last_name}</span>
                            <div><abbr className="_1ht7 timestamp" title="Hôm nay" data-utime="1535593524.915">8:45</abbr></div>
                        </div>
                        <div className="_1qt5 _5l-3 item-user-message">
                            <span className="_1htf item-message-newest"><span>{conversation.body}</span></span>
                        </div>
                    </div>
                </a>
            </div>
        </li>
    )
}

export default Home;
