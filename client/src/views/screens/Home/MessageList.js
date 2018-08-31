import React, { Component } from 'react';

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const conversation = this.props.conversation[0];
        // console.log('conversation', conversation);
        return(
            <li className="_5l-3 _1ht1 item-user" role="row" tabIndex="-1">
                <div className="_5l-3 _1ht5 item-user-content" id="row_header_id_user:100002617552652" role="gridcell" tabIndex="-1">
                    <a data-href={"/t/"+conversation.conversationId} href={"/t/"+conversation.conversationId} className="_1ht5 _2il3 _5l-3 _3itx item-content" role="link" tabIndex="-1">
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
}
export default MessageList;