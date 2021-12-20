import React, {useEffect, useState} from 'react'
import {Comment, Avatar, Button, Input} from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const {TextArea } = Input;

function SingleComment(props) {

    const [OpenReply, setOpenReply] = useState(false)
    const [commentValue, setCommentValue] = useState("")
    const user = useSelector(state => state.user);

    const onClickReplyOpen = (event) =>
    {
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (event) =>
    {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) =>
    {
        event.preventDefault();

        const variables = {
            content : commentValue,
            writer : user.userData._id,
            postId : props.postId,
            //추가
            responseTo : props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success)
            {
                console.log(response.data.result)
                setCommentValue("")
                props.refreshFunction(response.data.result)
            }

            else{
                alert("댓글 저장 실패")
            }
        })
    }

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]
    return (
        <div>
            <Comment
                actions = {actions}
                author = {props.comment.writer.name}
                avatar={<Avatar src = { props.comment.writer.image} alt />}
                content = {<p> {props.comment.content}</p>}
            />

            {OpenReply && 
                <form style={{display : 'flex'}} onSubmit={onSubmit}>
                    <textarea
                        style={{width : '100%', borderRadius : '5px'}}
                        onChange={onHandleChange}
                        value={commentValue}
                        placeholder="코멘트를 작성해주세요"
                    />

                    <br/>
                    <button style={{width : '20%', height : '52px'}} onClick={onSubmit}>Submit</button>
                </form>
            }

            
        </div>
    )
}

export default SingleComment
