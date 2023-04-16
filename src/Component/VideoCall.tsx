// import { Alert, AppBar, Avatar, Button, IconButton, Input, Toolbar, Typography } from '@mui/material'
// import { deepPurple } from '@mui/material/colors'
// import React, { useState, useEffect, useRef } from 'react'
// import WebSocketService from '../Service/sockitservice1'
// import Chat from './Chat'


// interface State {
//     UserName: string
//     Flag: boolean
//     alert: boolean
//     connected: boolean
//     id: any
// }

// const VideoCall: React.FC = () => {
//     const inputRefMessage = React.useRef<HTMLInputElement>(null)


//     const configuration = {
//         'iceServers': [{
//             'urls': [
//                 'stun:stun.l.google.com:19302',
//                 'stun:stun1.l.google.com:19302',
//                 'stun:stun2.l.google.com:19302',
//                 'stun:stun3.l.google.com:19302',
//                 'stun:stun4.l.google.com:19302',
//                 'stun:stun.ekiga.net',
//                 'stun:stun.ideasip.com',
//                 'stun:stun.rixtelecom.se',
//                 'stun:stun.schlund.de',
//                 'stun:stun.stunprotocol.org:3478',
//                 'stun:stun.voiparound.com',
//                 'stun:stun.voipbuster.com',
//                 'stun:stun.voipstunt.com',
//                 'stun:stun.voxgratia.org'
//             ]
//         }]
//     }
//     const localStream = useRef<MediaStream | null>(null);
//     const localRef = useRef<HTMLVideoElement>(null)
//     const remoteRef = useRef<HTMLVideoElement>(null)
//     const peerConnection = React.useRef<RTCPeerConnection>();
//     const offer = useRef<RTCSessionDescriptionInit>()
//     const ioRef = useRef<WebSocketService>();
//     const [messages, setMessage] = useState<any[]>([]);
//     const [name, setName] = useState<State>({ UserName: Math.random().toString(36).substring(2, 6), Flag: true, alert: false, connected: false, id: 1 })



//     const onMessageReceived = async (message: any): Promise<void> => {
//         try {

//             let data = JSON.parse(JSON.parse(message).body);
//             console.log(data.offer.type);
//             // console.log(data.username + "=+" + name.UserName);

//             if (data.offer.type === "answer" && data.username !== name.UserName) {
//                 console.log("answer coming");
//                 // console.log(data.offer);
//                 const remoteDesc = new RTCSessionDescription(data.offer);
//                 if (peerConnection.current)
//                     await peerConnection.current?.setRemoteDescription(remoteDesc);
//                 // peerConnection.current?.setLocalDescription()

//             }
//             else if (data.offer.type === "offer" && data.username !== name.UserName) {
//                 console.log("offer coming");
//                 // console.log((data.offer));
//                 peerConnection.current?.setRemoteDescription(new RTCSessionDescription((data.offer)));
//                 const answer = await peerConnection.current?.createAnswer();
//                 await peerConnection.current?.setLocalDescription(answer);

//                 const chatMessage = {
//                     id: name.id,
//                     username: name.UserName,
//                     message: "",
//                     offer: {
//                         type: answer?.type,
//                         sdp: answer?.sdp
//                     }
//                 }
//                 await ioRef.current?.send(chatMessage, 1);


//             }
//             else if (data.offer.type === "new-ice-candidate" && data.username !== name.UserName) {
//                 console.log("internal" + data.username);

//                 peerConnection.current?.addIceCandidate(JSON.parse(data.offer.sdp))
//             };
//             setMessage(prev => ([...prev, JSON.parse(JSON.parse(message).body)]));
//         } catch (error) {
//             console.log(error);

//         }


//     }

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//                     localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//                     if (localStream && localRef.current) {
//                         localRef.current.srcObject = localStream.current
//                     }
//                     peerConnection.current = new RTCPeerConnection(configuration)
//                     for (const track of localStream.current.getTracks()) {
//                         peerConnection.current.addTrack(track, localStream.current);
//                     }
//                 } else {
//                     console.log(navigator);

//                 }

//                 // peerConnection.current.addEventListener('icecandidate', (event: RTCPeerConnectionIceEvent) => {
//                 //     if (event.candidate) {
//                 //         console.log('ICE candidate:', event.candidate);

//                 //     }
//                 // });
//                 // peerConnection.current.addEventListener('iceconnectionstatechange', () => {
//                 //     console.log("state Change");
//                 // })
//                 if (peerConnection.current) {
//                     peerConnection.current.onicecandidate = (event) => {
//                         console.log(event.candidate);

//                         if (event.candidate) {
//                             // Send the ICE candidate to the remote peer
//                             const chatMessage = {
//                                 id: name.id,
//                                 username: name.UserName,
//                                 message: "",
//                                 offer: {
//                                     type: "new-ice-candidate",
//                                     sdp: JSON.stringify(event.candidate)
//                                 }
//                             }
//                             if (ioRef.current)
//                                 ioRef.current.send(chatMessage, name.id);
//                         }
//                     }

//                     peerConnection.current.addEventListener('track', async (event) => {
//                         console.log("remote stream");

//                         const [remoteStream] = event.streams;
//                         if (remoteRef.current)
//                             remoteRef.current.srcObject = remoteStream;
//                     });

//                     peerConnection.current.addEventListener('connectionstatechange', event => {
//                         if (peerConnection.current && peerConnection.current.connectionState === 'connected') {
//                             console.log("conneted");

//                         }
//                     });
//                 }
//                 ioRef.current = new WebSocketService(onMessageReceived);

//             } catch (error) {
//                 console.log(error);

//             }
//         }
//         fetchData();

//     }, []);


//     useEffect(() => {
//         if (!peerConnection.current) {
//             return;
//         }
//         peerConnection.current.ontrack = ({ track, streams }) => {
//             track.onunmute = () => {
//                 if (remoteRef.current && !remoteRef.current.srcObject) {
//                     remoteRef.current.srcObject = streams[0];
//                 }
//             };
//         };
//     }, [peerConnection]);






//     const startChat = async (): Promise<void> => {
//         await ioRef.current?.connect(name.id);

//         setName(prevState => ({ ...prevState, connected: true }))
//     }

//     const sendMessage = async (): Promise<void> => {

//         offer.current = await peerConnection.current?.createOffer({ iceRestart: true });
//         await peerConnection.current?.setLocalDescription(offer.current);

//         if (inputRefMessage.current !== null && ioRef.current?.stompClient?.connected)
//             if (ioRef.current) {
//                 const chatMessage = {
//                     id: name.id,
//                     username: name.UserName,
//                     message: inputRefMessage.current?.value,
//                     offer: {
//                         type: offer.current?.type,
//                         sdp: offer.current?.sdp
//                     }
//                 }
//                 ioRef.current.send(chatMessage, name.id);
//                 inputRefMessage.current.value = '';
//             }
//     }


//     return (
//         <>
//             {name.alert && <Alert severity="success" color="info">
//                 {"Enter a valid input !!"}
//             </Alert>}
//             <AppBar position="static">
//                 <Toolbar variant="dense">
//                     <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
//                     </IconButton>
//                     <Typography variant="h6" color="inherit" component="div">
//                         Photos
//                     </Typography>
//                 </Toolbar>
//             </AppBar>
//             <Typography className='.MuiTypography-h2' >Enter Your Name</Typography>
//             <div className='format'>
//                 <div className='console'>
//                     <Avatar sx={{ bgcolor: deepPurple[500] }}>{name.UserName.charAt(0)}</Avatar>
//                     <div>
//                         <Button type='button' onClick={startChat} variant="outlined" disabled={!name.Flag || name.connected}>Connect</Button>


//                     </div>
//                     <div>
//                     </div>
//                 </div>

//                 <div style={{ width: "60%", height: "55%", margin: "auto", justifyContent: 'center', border: '2px solid black', borderRadius: "10px" }} hidden={!name.connected}>
//                     <Input className='message' type='text' inputRef={inputRefMessage} />
//                     <Button type='button' variant="outlined" onClick={sendMessage}>Send Message</Button>
//                 </div>

//             </div>
//             <video ref={localRef} autoPlay muted={true} >video</video>
//             <video ref={remoteRef} autoPlay >video</video>
//             <Chat userMessages={messages} name={name.UserName} />

//         </>
//     )
// }

// export default VideoCall
