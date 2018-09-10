import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import { formatTime } from '../../../core/utils';
import { socket_key } from '../../../core/constants';
import { socket } from '../../../core/socket_connect';

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
        console.log('new_message', new_message);
        let title_conversation = '';
        participants.map((item, key) => {
            let full_name = item.profile.first_name + ' ' + item.profile.last_name;
            if(key + 1 !== participants.length) {
                return title_conversation = title_conversation + full_name + ', ';
            } else {
                return title_conversation = title_conversation + full_name;
            }
        })
        let class_viewed = '';
        if(new_message.viewer !== undefined) {
            if(new_message.viewer.indexOf(JSON.parse(localStorage.Auth).user._id) >= 0) {
                console.log('new_message.viewed');
                class_viewed = 'viewed';
            }
        }
        // if(item.author._id === JSON.parse(localStorage.Auth).user._id) {

        // }
        return (
            <div className="item-user" role="row" tabIndex="-1">
                <div className="item-user-content" id="row_header_id_user:100002617552652" role="gridcell" tabIndex="-1">
                    <a id={"TooltipTitleConversation_" + new_message.conversationId} href={"/t/"+new_message.conversationId} className="item-content">
                        <div aria-hidden="true" className="item-avt" data-tooltip-content={title_conversation} data-hover="tooltip" data-tooltip-position="right" data-tooltip-alignh="center">
                            <div className="user-item">
                                <div className="user-item-content">
                                    <img src="https://lh3.googleusercontent.com/-K5C9ZdyO2EU/AAAAAAAAAAI/AAAAAAAAAAA/AAnnY7od-II8C10xoUf69CQaJHoTg1Tj6g/s32-c-mo/photo.jpg" width="50" height="50" alt="" className="img" />
                                </div>
                            </div>
                        </div>
                        <div className={class_viewed + " item-name"}>
                            <div className="item-user-name">
                                <span className="user-name">{title_conversation}</span>
                                <span className="timestamp" title="Hôm nay" data-utime={new_message.createdAt}>
                                {formatTime(new_message.createdAt)}
                                </span>
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
            </div>
        )
    }
}
export default ConversationList;