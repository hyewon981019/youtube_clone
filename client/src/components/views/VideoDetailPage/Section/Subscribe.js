import Axios from 'axios'
import React, { useState, useEffect} from 'react'

export default function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {

        let variable = { userTo : props.userTo}
        
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response =>
                {
                    if(response.data.success)
                    {
                        setSubscribeNumber(response.data.subscribeNumber);
                    }

                    else 
                    {
                        alert("구독자 수 불러오기 실패")
                    }
                })

        let subscribedVariable = { userTo : props.userTo, userFrom : localStorage.getItem('userId')} //현재 접속한 아이디를 로컬스토리지에 저장했고, userFrom에 넣음

        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response =>
                {
                    if(response.data.success)
                    {
                        setSubscribed(response.data.subscribed)

                    }
                    else
                    {
                        alert("정보를 받아오기 실패")
                    }
                })
    }, []);

    const onSubscribe = (event) =>
    {
        let subScribeVariable = {
            userTo : props.userTo,
            userFrom : props.userFrom
        }
        if(Subscribed)
        {
            Axios.post('/api/subscribe/unSubscribe', subScribeVariable)
                .then(response => {
                    if(response.data.success)
                    {
                        setSubscribeNumber(SubscribeNumber-1)
                        setSubscribed(!Subscribed)
                    }
                    else
                    {
                        alert("구독 취소 실패")
                    }
                })
        }
        else
        {
            Axios.post('/api/subscribe/subscribe', subScribeVariable)
                .then(response => {
                    if(response.data.success)
                    {
                        setSubscribeNumber(SubscribeNumber+1)
                        setSubscribed(!Subscribed)

                    }
                    else
                    {
                        alert("구독 신청 실패")
                    }
                })


        }
    }

    return (
        <div>
            <button
                style={{backgroundColor :  `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius : '4px',
                color : 'white', padding : '10px 16px',
                fontWeight : '500', fontSize :'1rem', textTransform : 'uppercase', border : 'none'
            }}
                onClick={onSubscribe}>
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>

        </div>
    )
}
