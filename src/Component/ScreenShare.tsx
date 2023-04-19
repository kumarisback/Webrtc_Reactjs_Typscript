import { Alert, AppBar, Avatar, Button, IconButton, Input, Toolbar, Typography } from '@mui/material'
import { deepPurple } from '@mui/material/colors'
import React, { useState, useEffect, useRef } from 'react'
import WebSocketService from '../Service/sockitservice1'
import Chat from './Chat'
import Video from './Video'



interface State {
    UserName: string
    Flag: boolean
    alert: boolean
    connected: boolean
    id: any
}

const ScreenShare: React.FC = () => {
    const configuration = {
        'iceServers': [{
            'urls': [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302',
                'stun:stun.ekiga.net',
                'stun:stun.ideasip.com',
                'stun:stun.rixtelecom.se',
                'stun:stun.schlund.de',
                'stun:stun.stunprotocol.org:3478',
                'stun:stun.voiparound.com',
                'stun:stun.voipbuster.com',
                'stun:stun.voipstunt.com',
                'stun:stun.voxgratia.org'
            ]
        }]
    }
    const [isScreen, setIsScreen] = useState(true)
    const [mounted, setMounted] = useState<boolean>(false);
    const localStream = useRef<MediaStream | null>(null);
    // const localStream2 = useRef<MediaStream | null>(null);
    const localRef = useRef<HTMLVideoElement>(null)
    const remoteRef = useRef<HTMLVideoElement>(null)
    // const remoteRef2 = useRef<HTMLVideoElement>(null)
    const peerConnection = React.useRef<RTCPeerConnection>();
    const offer = useRef<RTCSessionDescriptionInit>()
    const inputRef = React.useRef<HTMLInputElement>()
    const inputRefId = React.useRef<HTMLInputElement>()
    // const inputRefMessage = React.useRef<HTMLInputElement>(null)
    const ioRef = useRef<WebSocketService>();
    const [messages, setMessage] = useState<any[]>([]);
    const [name, setName] = useState<State>({ UserName: "", Flag: false, alert: false, connected: false, id: null })




    const onMessageReceived = async (message: any): Promise<void> => {

        let data = JSON.parse(JSON.parse(message).body);

        if (data.offer.type.length < 1) {
            setMessage(prev => ([...prev, JSON.parse(JSON.parse(message).body)]));
            return
        }

        if (peerConnection.current && peerConnection.current.connectionState === 'connected' && peerConnection.current.localDescription !== null && peerConnection.current.remoteDescription !== null) {
            // alert("Busy");
            console.log("busy");

            return
        }


        // console.log(typeof data.offer.type);
        // console.log(data);


        try {

            if (data.offer.type === "offer" && data.username !== ioRef.current?.data.UserName) {
                if (navigator.mediaDevices) {
                    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    if (localStream && localRef.current) {
                        localRef.current.srcObject = localStream.current
                    }

                    for (const track of localStream.current.getTracks()) {
                        peerConnection.current?.addTrack(track, localStream.current);
                    }
                }
                peerConnection.current?.setRemoteDescription(new RTCSessionDescription((data.offer)));
                const answer = await peerConnection.current?.createAnswer();
                await peerConnection.current?.setLocalDescription(answer);

                // console.log("offerComming");

                const chatMessage = {
                    id: ioRef.current?.data.id,
                    username: ioRef.current?.data.UserName,
                    message: "",
                    offer: {
                        type: answer?.type,
                        sdp: answer?.sdp
                    }
                }
                // console.log(chatMessage);

                // console.log("offerComming");

                ioRef.current?.send(chatMessage, ioRef.current?.data.id);
                // console.log("offerComming");

            }
            else if (data.offer.type === "answer" && data.username !== ioRef.current?.data.UserName) {
                // console.log("answer coming");
                const remoteDesc = new RTCSessionDescription(data.offer);
                if (peerConnection.current)
                    await peerConnection.current?.setRemoteDescription(remoteDesc);

            }
            else if (data.offer.type === "new-ice-candidate" && data.username !== ioRef.current?.data.UserName) {
                if (peerConnection.current?.remoteDescription !== null)
                    peerConnection.current?.addIceCandidate(JSON.parse(data.offer.sdp))
            };
        } catch (error) {
            // console.log(error);
        }


    };

    useEffect(() => {
        if (!mounted) {
            async function fetchData() {
                setMounted(true)
                try {
                    ioRef.current = new WebSocketService(onMessageReceived);
                    // ioRef.current = new WebSocketService(
                    //   (          message: any) => onMessageReceived(message, name),
                    //   name
                    // );
                    peerConnection.current = new RTCPeerConnection(configuration)
                    // if (navigator.mediaDevices) {
                    //     localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    //     if (localStream && localRef.current) {
                    //         localRef.current.srcObject = localStream.current
                    //     }

                    //     for (const track of localStream.current.getTracks()) {
                    //         peerConnection.current.addTrack(track, localStream.current);
                    //     }
                    // }
                } catch (error) {
                    // console.log(error);

                }
            }
            fetchData();
            if (peerConnection.current) {
                peerConnection.current.onicecandidate = (event) => {


                    if (event.candidate) {
                        // Send the ICE candidate to the remote peer
                        const chatMessage = {
                            id: ioRef.current?.data.id,
                            username: ioRef.current?.data.UserName,
                            message: "",
                            offer: {
                                type: "new-ice-candidate",
                                sdp: JSON.stringify(event.candidate)
                            }
                        }

                        if (ioRef.current)
                            ioRef.current.send(chatMessage, ioRef.current.data.id);
                    }
                }



                peerConnection.current.addEventListener('connectionstatechange', event => {
                    if (peerConnection.current && peerConnection.current.connectionState === 'connected') {
                        // console.log("conneted");
                    }
                });
            }
        }


    }, []);

    useEffect(() => {
        if (!peerConnection.current) {
            return;
        }
        peerConnection.current.ontrack = (event) => {

            //for adding both camera and streeam together


            // if (event.transceiver.direction === "recvonly") {
            //     console.log("screen");

            //     if (remoteRef2.current && !remoteRef2.current.srcObject) {
            //         remoteRef2.current.srcObject = event.streams[0];
            //     }
            // } else {
            //     console.log("camera");
            //     if (remoteRef.current && !remoteRef.current.srcObject) {
            //         remoteRef.current.srcObject = event.streams[0];
            //     }
            // }
        };
        peerConnection.current.ontrack = ({ track, streams }) => {
            track.onunmute = () => {
                if (remoteRef.current && !remoteRef.current.srcObject) {
                    remoteRef.current.srcObject = streams[0];
                }
            };
        };
    }, [peerConnection]);

    const onSubmitHandler = () => {
        if (name.UserName === "") {
            setName(prevState => ({ ...prevState, alert: true }))
            setTimeout(() => {
                setName(prevState => ({ ...prevState, alert: false }))
            }, 5000);
            // console.log(name.UserName);

            return
        }
        setName(prevState => ({ ...prevState, Flag: true }))
        // console.log(name.UserName);


    }

    useEffect(() => {
        ioRef.current?.changeData(name);
    }, [name]);


    const startChat = async (): Promise<void> => {
        if (!inputRefId.current?.value) {
            setName(prevState => ({ ...prevState, alert: true }))
            setTimeout(() => {
                setName(prevState => ({ ...prevState, alert: false }))
            }, 5000);
            return
        }
        await ioRef.current?.connect(inputRefId.current?.value);
        if (ioRef.current && ioRef.current.stompClient !== null)
            setName(prevState => ({ ...prevState, id: inputRefId.current?.value }));
        setTimeout(() => {
            setName(prevState => ({ ...prevState, connected: ioRef.current?.stompClient?.connected ?? false }));
            if (!ioRef.current?.stompClient?.connected) {
                alert("Not connected")
            }
        }, 1000)

    }

    // const sendMessage = async (): Promise<void> => {

    //     if (inputRefMessage.current !== null)
    //         if (ioRef.current) {
    //             const chatMessage = {
    //                 id: name.id,
    //                 username: name.UserName,
    //                 message: inputRefMessage.current?.value,
    //                 offer: {
    //                     type: "",
    //                     sdp: ""
    //                 }
    //             }
    //             ioRef.current.send(chatMessage, name.id);
    //             inputRefMessage.current.value = '';
    //         }
    // }

    const sendMessage = async (message: String): Promise<void> => {

        if (message !== null && message.length > 0) {
            if (ioRef.current) {
                const chatMessage = {
                    id: name.id,
                    username: name.UserName,
                    message: message,
                    offer: {
                        type: "",
                        sdp: ""
                    }
                }
                ioRef.current.send(chatMessage, name.id);
                // inputRefMessage.current.value = '';
            }
        }

        else {
            setName(prevState => ({ ...prevState, alert: true }))
            setTimeout(() => {
                setName(prevState => ({ ...prevState, alert: false }))
            }, 5000);
            return
        }

    }



    // const onCall = async () => {

    //     localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //     if (localStream && localRef.current) {
    //         localRef.current.srcObject = localStream.current
    //     }
    //     for (const track of localStream.current.getTracks()) {
    //         peerConnection.current?.addTrack(track, localStream.current);
    //     }

    //     // for adding screen as well with camera
    //     // localStream2.current = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    //     // for (const track of localStream2.current.getTracks()) {
    //     //     peerConnection.current?.addTrack(track, localStream2.current);
    //     // }



    //     offer.current = await peerConnection.current?.createOffer({ iceRestart: true });
    //     await peerConnection.current?.setLocalDescription(offer.current);


    //     if (ioRef.current?.stompClient?.connected) {
    //         const chatMessage = {
    //             id: name.id,
    //             username: name.UserName,
    //             message: "",
    //             offer: {
    //                 type: offer.current?.type,
    //                 sdp: offer.current?.sdp
    //             }
    //         }

    //         ioRef.current.send(chatMessage, name.id);

    //     }
    //     return

    // }
    const onCall = async () => {

        localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (localStream && localRef.current) {
            localRef.current.srcObject = localStream.current
        }
        else {
            alert("Please try again")
            return
        }
        for (const track of localStream.current.getTracks()) {
            peerConnection.current?.addTrack(track, localStream.current);
        }



        offer.current = await peerConnection.current?.createOffer({ iceRestart: true });
        await peerConnection.current?.setLocalDescription(offer.current);


        if (ioRef.current?.stompClient?.connected) {
            const chatMessage = {
                id: name.id,
                username: name.UserName,
                message: "",
                offer: {
                    type: offer.current?.type,
                    sdp: offer.current?.sdp
                }
            }

            ioRef.current.send(chatMessage, name.id);

        }
        return

    }

    const onRename = (event: React.ChangeEvent<HTMLInputElement>): void => {
        // this way we can use shownabove to read data from input box using ref and react change event
        if (inputRef.current?.value !== null) {
            setName(prev => ({ ...prev, UserName: inputRef.current?.value ?? '' }))
        }


    }



    const switchVideo = async () => {
        if (isScreen) {
            // console.log("isScreen");

            localStream.current = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
            // if (localStream && localRef.current) {
            //     localRef.current.srcObject = localStream.current
            // }
            for (const sender of peerConnection.current?.getSenders() || []) {
                if (sender.track && sender.track.kind === 'video') {
                    sender.replaceTrack(localStream.current.getVideoTracks()[0]);
                }
            }
        }
        else {
            // console.log("call");

            localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            // if (localStream && localRef.current) {
            //     localRef.current.srcObject = localStream.current
            // }

            for (const sender of peerConnection.current?.getSenders() || []) {
                if (sender.track && sender.track.kind === 'video') {
                    sender.replaceTrack(localStream.current.getVideoTracks()[0]);
                }
            }
        }


    }

    return (
        <>
            {name.alert && <Alert severity="error" color="warning">
                {"Enter a valid input !!"}
            </Alert>}
            <AppBar position="static">
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    </IconButton>
                    <Typography variant="h6" color="inherit" component="div">
                        Arun Kumar
                    </Typography>
                </Toolbar>
            </AppBar>

            <div style={{ position: 'relative', top: 0, left: 0, width: "300px", float: "left", height: "100%" }}>
                <div className='console'>
                    <Avatar sx={{ bgcolor: deepPurple[500] }}>{name.UserName.charAt(0)}</Avatar>
                    <div hidden={name.Flag}>
                        Enter Your Username: <Input type='text' inputRef={inputRef} onChange={onRename} disabled={name.Flag} />
                    </div>
                    <div>
                        <div hidden={name.Flag}>
                            <Button type='button' variant="outlined" onClick={onSubmitHandler} disabled={name.Flag}>Set Name</Button>
                        </div>
                        {/* <Button type='button' variant="outlined" disabled={!name.Flag || name.connected}>Connect</Button> */}
                        <div hidden={!name.connected}>
                            <Button type='button' disabled={!name.connected} onClick={() => {
                                ioRef.current?.close()
                                setName(prevState => ({ ...prevState, connected: false }))
                            }} variant="outlined"  >Close Chat</Button>
                            <Button type='button' disabled={!name.connected} variant="outlined" onClick={onCall}>Call</Button>
                        </div>
                        <div hidden={!name.connected}>
                            <Button type='button' disabled={!name.connected} variant="outlined" onClick={() => { setIsScreen(!isScreen); switchVideo() }}>{isScreen ? "Share screen" : "Camera"}</Button>
                        </div>

                    </div>
                </div>
                <div style={{ border: '2px solid black', borderRadius: "10px" }} hidden={!name.Flag}>
                    <h5 >Do you have any room id or create by providing by any  random number</h5>
                    <Input className='MuiInputLabel-outlined' type='text' inputRef={inputRefId} />
                    <Button disabled={!name.Flag || name.connected} type='button' variant="outlined" onClick={startChat}>Connect</Button>
                </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyItems: 'center', justifyContent: "center" }} hidden={!name.connected}>
                <Video stream={remoteRef} w={500} h={400} />

                <div  >
                    <Video stream={localRef} w={80} h={100} />
                    <Chat userMessages={messages} name={name.UserName} hide={!name.connected} receiver={sendMessage} />
                    {/* <div hidden={!name.connected} style={{ width: "60%", height: "55%", justifyContent: 'center', marginTop: "100px" }
                    }   >
                        <Input className='message' type='text' inputRef={inputRefMessage} />
                        <Button type='button' variant="outlined" onClick={sendMessage}>Send Message</Button>

                    </div> */}
                </div>
            </div >
            {/* {ioRef.current && <VideoChat io={ioRef.current} username={name.UserName} ioId={name.id} />} */}
            {/* <div style={{ width: "60%", height: "55%", justifyContent: 'center', marginTop: "100px" }
            } hidden={!name.connected}>
                <Input className='message' type='text' inputRef={inputRefMessage} />
                <Button type='button' variant="outlined" onClick={sendMessage}>Send Message</Button>

            </div> */}

            {/* for stream data */}
            {/* <Video stream={remoteRef2} w={500} h={300} /> */}

        </>
    )
}

export default ScreenShare
