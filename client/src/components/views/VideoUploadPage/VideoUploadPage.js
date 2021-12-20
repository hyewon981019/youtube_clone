import React, {useState} from 'react'
import {Typography, Button, Form, message, Input, Icon} from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux'; //스토어 쓰기 위함

const {Title} = Typography;
const {TextArea} = Input;

const PrivateOptions = [
    { value : 0, label : "Private" },
    { value : 1, label : "Public" }
]

const CategoryOptions = [
    {value : 0, label : "Film & Animation"},
    {value : 1, label : "Autos & Vehicles"},
    {value : 3, label : "Film & Animation"},
    {value : 4, label : "Autos & Vehicles"},

]

function VideoUploadPage(props) {

    const user = useSelector(state => state.user); //state에 가서 user를 가져옴, user 정보 다 담김
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0) //private : 0
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (event) =>
    {
        setVideoTitle(event.currentTarget.value)
    }

    const onDescriptionChange = (event) =>
    {
        setDescription(event.currentTarget.value)
    }

    const onPrivateChange = (event) =>
    {
        setPrivate(event.currentTarget.value)
    }

    const onCategoryChange = (event) =>
    {
        setCategory(event.currentTarget.value)
    }

    const onDrop = (files) =>
    {

        let formData = new FormData;
        const config = {
            header : {'content-type': 'multipart/form-data'} //파일 보낼때 헤더에 실어야함
        }
        
        formData.append("file", files[0]) //첫번째 파일

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response =>
                {
                    if(response.data.success)
                    {
                        console.log(response.data)

                        let variable = {
                            url : response.data.url,
                            fileName : response.data.fileName
                        }

                        setFilePath(response.data.url)

                        Axios.post('/api/video/thumbnail', variable) //서버에 다시 그대로 보냄
                            .then(response=> {
                                if(response.data.success)
                                {
                                    setDuration(response.data.fileDuration);
                                    setThumbnailPath(response.data.url)
                                }

                                else
                                {
                                    alert('썸네일 생성 실패')
                                }
                            })



                    }
                    else{
                        alert("비디오 업로드 실패")
                    }
                })

    }

    const onSubmit = (event) =>
    {
        event.preventDefault();

        const variables = {
            writer : user.userData._id,
            title : VideoTitle,
            description : Description,
            privacy : Private,
            filePath : FilePath,
            category : Category,
            duration : Duration,
            thumbnail : ThumbnailPath,
        }
        Axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if(response.data.success)
                {
                    message.success("업로드 성공")
                    setTimeout( () => {
                        props.history.push('/')
                    })
                }else{
                    alert("비디오 업로드 실패")
                }
            })
    }


    return (
        <div style={{ maxWidth : '700px', margin : '2rem auto'}}>
            <div style={{ textAlign : 'center', marginBottom : '2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit = {onSubmit}>
                <div style={{display : 'flex', justifyContent : 'space-between'}}>
                    <Dropzone
                    onDrop={onDrop} //
                    multiple={false}
                    maxSize={100000000}>
                        {({getRootProps, getInputProps}) => (
                            <div style={{width : '300px', height : '240px', border : '1px solid lightgray', display:'flex', alignItems : 'center', justifyContent : 'center'}}
                            {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize : '3rem'}} />
                            </div>
                        )}
                    </Dropzone>
                    {
                        ThumbnailPath && 
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail"/>
                        </div>
                    }
                    

                </div>

                <br/>
                <br/>
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value = {VideoTitle} //반영할 값
                />

                <br/>
                <br/>
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value ={Description}
                />

                <br/>
                <br/>

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                
                </select>
                
                <br/>
                <br/>

                <select onChange = {onCategoryChange}>
                {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br/>
                <br/>
                
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form>
        </div>
    )
}
export default VideoUploadPage;