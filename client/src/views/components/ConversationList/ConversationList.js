import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import io from 'socket.io-client';
import axios from 'axios';
import { formatTime } from '../../../core/utils';

import { socket_key } from '../../../core/constants';

const server = 'http://localhost'
// const server = 'http://192.168.11.113'
const port_client = 5002;
const port_api = 5000;
const url_client = server + ':' + port_client;
const url_api = server + ':' + port_api;

const socket = io.connect(url_api);

class ConversationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltipOpen: false
        }
        
        const conversationId = this.props.conversation.new_message.conversationId
        socket.emit(socket_key.ENTER_CONVERSATION, conversationId);
        
        socket.on(socket_key.REFRESH_MESSAGES, (data) => {
            this.props.refreshConversationList(data);
        });
    }

    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        })
    }

    render() {
        const new_message = this.props.conversation.new_message;
        const participants = this.props.conversation.participants;

        let title_conversation = '';
        participants.map((item, key) => {
            let full_name = item.profile.first_name + ' ' + item.profile.last_name;
            if(key + 1 !== participants.length) {
                title_conversation = title_conversation + full_name + ', ';
            } else {
                title_conversation = title_conversation + full_name;
            }
        })
        return (
            <li className="item-user" role="row" tabIndex="-1">
                <div className="item-user-content" id="row_header_id_user:100002617552652" role="gridcell" tabIndex="-1">
                    <a id={"TooltipTitleConversation_" + new_message.conversationId} href={"/t/"+new_message.conversationId} className="item-content">
                        <div aria-hidden="true" className="item-avt" data-tooltip-content="Trinh Tống" data-hover="tooltip" data-tooltip-position="right" data-tooltip-alignh="center">
                            <div className="user-item">
                                <div className="user-item-content">
                                    <img src="https://lh3.googleusercontent.com/-K5C9ZdyO2EU/AAAAAAAAAAI/AAAAAAAAAAA/AAnnY7od-II8C10xoUf69CQaJHoTg1Tj6g/s32-c-mo/photo.jpg" width="50" height="50" alt="" className="img" />
                                </div>
                            </div>
                        </div>
                        <div className="item-name">
                            <div className="item-user-name">
                                <span className="user-name">{title_conversation}</span>
                                <div><abbr className="timestamp" title="Hôm nay" data-utime={new_message.createdAt}>{formatTime(new_message.createdAt)}</abbr></div>
                            </div>
                            <div className="item-user-message">
                                <span className="item-message-newest"><span>{new_message.body}</span></span>
                            </div>
                        </div>
                    </a>
                </div>
                <Tooltip target={"TooltipTitleConversation_" + new_message.conversationId} placement="right" isOpen={this.state.tooltipOpen} toggle={this.toggle} >
                    {title_conversation}
                </Tooltip>
            </li>
        )
    }
}
export default ConversationList;