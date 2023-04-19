import React, { useEffect } from 'react'

import { CardCover, Card, CardContent, Typography } from '@mui/joy'
type Props = {
    stream: any,
    w: number,
    h: number,
}



const Video = (props: Props) => {


    return (
        <Card style={{ width: props.w + "px", height: props.h + "px", margin: "2%" }} component="li" >
            <CardCover>
                <video
                    ref={props.stream}
                    style={{ objectFit: 'fill' }}
                    autoPlay
                    loop
                    muted={props.w === 80 ? true : false}
                // src="https://assets.codepen.io/6093409/river.mp4"
                />

            </CardCover>
        </Card>
    )
}

export default Video