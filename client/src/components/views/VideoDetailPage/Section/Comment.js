import Axios from 'axios'
import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment';
export default function Comment(props) {

    const videoId = props.postId;
    // const variable = {videoId : videoId}

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
            {//ok
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
                (!comment.responseTo && <SingleComment refreshFunction={props.refreshFunction} comment = {comment} postId = {videoId}/>) //윗댓글이 없는 애들만 찍어내기 
                
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
