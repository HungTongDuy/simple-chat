import React from 'react';
import axios from 'axios';
import { CustomInput, Button, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { url_api } from '../../../core/constants';

class DialogNewConversation extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            user_list : null
        }
    }

    componentWillMount() {
        axios.get(url_api + '/api/user', { 
            headers : {
                "x-access-token": JSON.parse(localStorage.Auth).token
            }
        }).then((res) => {
            this.setState({
                user_list: res.data.users
            })
        })
    }

    render() {
        const user_list = this.state.user_list;

        return (
            <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>Tạo mới cuộc trò chuyện</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="exampleEmail">Chọn bạn để trò chuyện</Label>
                        {user_list !== null ? 
                            user_list.map((item, key) => {
                                const full_name = item.profile.first_name + ' ' + item.profile.last_name;
                                if(item._id !== JSON.parse(localStorage.Auth).user._id) {
                                    return (
                                        <CustomInput key={key} onChange={this.props.handleChangeCheckbox} type="checkbox" id={item._id} value={item._id} label={full_name} />
                                    )
                                }
                            }) : ''
                        }
                    </FormGroup>
                    <FormGroup>
                        <Input type="text" name="textMessage" id="textMessage" placeholder={this.props.placeholderString} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.props.toggle}>Hủy</Button>
                    <Button color="primary" onClick={this.props.handleNewConversation}>Nhắn tin</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default DialogNewConversation;