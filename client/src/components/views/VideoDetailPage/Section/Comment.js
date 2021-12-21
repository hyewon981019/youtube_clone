import Axios from 'axios'
import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
export default function Comment(props) {

    const videoId = props.postId;

    const user = useSelector(state => state.user);

    const [commentValue, setCommentValue] = useState("")

    const handleClick = (event) =>
    {
        setCommentValue(event.currentTarget.value)

    }

    const onSubmit = (event) =>
    {
        event.preventDefault(); //리프레시 방지

        const variables = {
            content : commentValue,
            writer : user.userData._id,
            postId : videoId
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success)
            {
                console.log(response.data.result)
                setCommentValue("") //다시 댓글은 빈 상태
                props.refreshFunction(response.data.result)

            }

            else{
                alert("댓글 저장 실패")
            }
        })

    }
    return (
        <div>
            <br/>
            <p>Replies</p>
            <hr/>

            {props.commentLists && props.commentLists.map((comment, index) => ( //deps 차이 반영하여 찍어내기
                (!comment.responseTo && 
                <React.Fragment>
                    <SingleComment refreshFunction={props.refreshFunction} 
                    comment = {comment} postId = {videoId}/>
                    {/* <ReplyComment /> */}
                </React.Fragment>
                
                ) 
                
            ))}
            


            <form style={{display : 'flex'}} onSubmit ={onSubmit}>
                <textarea
                    style={{width : '100%', borderRadius : '5px'}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해주세요"
                />

                <br/>
                <button style={{width : '20%', height : '52px'}} onClick ={onSubmit}>Submit</button>
            </form>
        </div>
    )
}
