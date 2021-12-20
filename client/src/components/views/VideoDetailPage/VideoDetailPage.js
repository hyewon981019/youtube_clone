import React, {useState, useEffect} from 'react'
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Section/SideVideo';
import Subscribe from './Section/Subscribe';
import Comment from './Section/Comment';
 function VideoDetailPage(props) {

    const videoId = props.match.params.videoId //url에 있는 아이디 인자 가져옴
    const variable = { videoId : videoId}

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    useEffect(()=> {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success)
                {
                    setVideoDetail(response.data.videoDetail)
                }
                else
                {
                    alert("비디오 정보 가져오기 실패")
                }
            })

            Axios.post('/api/comment/getComments', variable) //비디오아이디를 넣어주면 해당 댓글 다 가져옴
            .then(response => {
                if(response.data.success)
                {// ok
                    // console.log(response.data.comments)
                    setComments(response.data.comments)

                }

                else{
                    alert("댓글 불러오기 실패")
                }
            })
    }, [])

    const refreshFunction = (newComment) => //하위컴포넌트로부터 인자로 받은 것을 기존 리스트에 붙여서 새 리스트로
    {
        setComments(Comments.concat(newComment))
    }

    if(VideoDetail.writer)
    {

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo = {VideoDetail.writer._id} userFrom = {localStorage.getItem('userId')}/>;
        return (
            <Row gutter = {[16,16]}>
                <Col lg={18} xs={24}>

                    <div style={{ width : '100%', padding : '3rem 4rem'}}>
                        <video style={{width : "100%"}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />

                        <List.Item
                            actions={[subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description = {VideoDetail.description}
                            />
                        </List.Item>

                        {/* comments */}
                        <Comment refreshFunction={refreshFunction} commentLists = {Comments} postId = {videoId}/> 
                        {/* refreshFunction */}
                    </div>

                </Col>

                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    }
    else{
        return (
            <div>loading...</div>
        )
    }
}

export default VideoDetailPage;
