// import { Alert, AppBar, Avatar, Button, IconButton, Input, Toolbar, Typography } from '@mui/material'
// import { deepPurple } from '@mui/material/colors'
// import React, { useState, useEffect, useRef } from 'react'
// import WebSocketService from '../Service/sockitservice1'
// import Chat from './Chat'



// interface State {
//   UserName: string
//   Flag: boolean
//   alert: boolean
//   connected: boolean
//   id: any
// }

// const Socket1: React.FC = () => {
//   const configuration = {
//     'iceServers': [{
//       'urls': [
//         'stun:stun.l.google.com:19302',
//         'stun:stun1.l.google.com:19302',
//         'stun:stun2.l.google.com:19302',
//         'stun:stun3.l.google.com:19302',
//         'stun:stun4.l.google.com:19302',
//         'stun:stun.ekiga.net',
//         'stun:stun.ideasip.com',
//         'stun:stun.rixtelecom.se',
//         'stun:stun.schlund.de',
//         'stun:stun.stunprotocol.org:3478',
//         'stun:stun.voiparound.com',
//         'stun:stun.voipbuster.com',
//         'stun:stun.voipstunt.com',
//         'stun:stun.voxgratia.org'
//       ]
//     }]
//   }
//   const localStream = useRef<MediaStream | null>(null);
//   const localRef = useRef<HTMLVideoElement>(null)
//   const remoteRef = useRef<HTMLVideoElement>(null)
//   const peerConnection = React.useRef<RTCPeerConnection>();
//   const offer = useRef<RTCSessionDescriptionInit>()
//   const inputRef = React.useRef<HTMLInputElement>()
//   const inputRefId = React.useRef<HTMLInputElement>()
//   const inputRefMessage = React.useRef<HTMLInputElement>(null)
//   const ioRef = useRef<WebSocketService>();
//   const [messages, setMessage] = useState<any[]>([]);
//   const [name, setName] = useState<State>({ UserName: "", Flag: false, alert: false, connected: false, id: null })




//   const onMessageReceived = async (message: any): Promise<void> => {


//     let data = JSON.parse(JSON.parse(message).body);
//     console.log(data.offer.type);

//     try {

//       console.log(data.username)
//       console.log(ioRef.current?.data);
//       console.log(name);


//       if (data.offer.type === "offer" && data.username !== ioRef.current?.data.UserName) {
//         console.log("offerComming");

//         peerConnection.current?.setRemoteDescription(new RTCSessionDescription((data.offer)));
//         const answer = await peerConnection.current?.createAnswer();
//         await peerConnection.current?.setLocalDescription(answer);

//         console.log("offerComming");

//         const chatMessage = {
//           id: ioRef.current?.data.id,
//           username: ioRef.current?.data.UserName,
//           message: "",
//           offer: {
//             type: answer?.type,
//             sdp: answer?.sdp
//           }
//         }
//         console.log(chatMessage);

//         console.log("offerComming");

//         ioRef.current?.send(chatMessage, ioRef.current?.data.id);
//         console.log("offerComming");

//       }
//       else if (data.offer.type === "answer" && data.username !== ioRef.current?.data.UserName) {
//         console.log("answer coming");
//         const remoteDesc = new RTCSessionDescription(data.offer);
//         if (peerConnection.current)
//           await peerConnection.current?.setRemoteDescription(remoteDesc);

//       }
//       else if (data.offer.type === "new-ice-candidate" && data.username !== ioRef.current?.data.UserName) {
//         peerConnection.current?.addIceCandidate(JSON.parse(data.offer.sdp))
//       };
//     } catch (error) {
//       console.log(error);

//     }
//     if (data.message === "") {
//       return
//     }
//     setMessage(prev => ([...prev, JSON.parse(JSON.parse(message).body)]));
//   };

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         ioRef.current = new WebSocketService(onMessageReceived);
//         // ioRef.current = new WebSocketService(
//         //   (          message: any) => onMessageReceived(message, name),
//         //   name
//         // );
//         peerConnection.current = new RTCPeerConnection(configuration)
//         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//           localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//           if (localStream && localRef.current) {
//             localRef.current.srcObject = localStream.current
//           }

//           for (const track of localStream.current.getTracks()) {
//             peerConnection.current.addTrack(track, localStream.current);
//           }
//         }
//       } catch (error) {
//         console.log(error);

//       }
//     }
//     fetchData();
//     if (peerConnection.current) {
//       peerConnection.current.onicecandidate = (event) => {
//         // console.log(event.candidate);


//         if (event.candidate) {
//           console.log("inside event");

//           // Send the ICE candidate to the remote peer
//           const chatMessage = {
//             id: ioRef.current?.data.id,
//             username: ioRef.current?.data.UserName,
//             message: "",
//             offer: {
//               type: "new-ice-candidate",
//               sdp: JSON.stringify(event.candidate)
//             }
//           }
//           // console.log(name);

//           if (ioRef.current)
//             ioRef.current.send(chatMessage, ioRef.current.data.id);
//         }
//       }



//       peerConnection.current.addEventListener('connectionstatechange', event => {
//         if (peerConnection.current && peerConnection.current.connectionState === 'connected') {
//           console.log("conneted");

//         }
//       });
//     }


//   }, []);

//   useEffect(() => {
//     if (!peerConnection.current) {
//       return;
//     }
//     peerConnection.current.ontrack = ({ track, streams }) => {
//       track.onunmute = () => {
//         if (remoteRef.current && !remoteRef.current.srcObject) {
//           remoteRef.current.srcObject = streams[0];
//         }
//       };
//     };
//   }, [peerConnection]);

//   const onSubmitHandler = () => {
//     if (name.UserName === "") {
//       setName(prevState => ({ ...prevState, alert: true }))
//       console.log(name.UserName);

//       return
//     }
//     setName(prevState => ({ ...prevState, Flag: true }))
//     console.log(name.UserName);


//   }

//   useEffect(() => {

//     ioRef.current?.changeData(name);

//   }, [name]);
//   const startChat = async (): Promise<void> => {
//     await ioRef.current?.connect(inputRefId.current?.value);

//     setName(prevState => ({ ...prevState, connected: true, id: inputRefId.current?.value }));

//   }

//   const sendMessage = async (): Promise<void> => {

//     if (inputRefMessage.current !== null)
//       if (ioRef.current) {
//         const chatMessage = {
//           id: name.id,
//           username: name.UserName,
//           message: inputRefMessage.current?.value,
//           offer: {
//             type: "",
//             sdp: ""
//           }
//         }
//         ioRef.current.send(chatMessage, name.id);
//         inputRefMessage.current.value = '';
//       }
//   }

//   const onCall = async () => {

//     offer.current = await peerConnection.current?.createOffer({ iceRestart: true });
//     await peerConnection.current?.setLocalDescription(offer.current);


//     if (ioRef.current?.stompClient?.connected) {
//       const chatMessage = {
//         id: name.id,
//         username: name.UserName,
//         message: "",
//         offer: {
//           type: offer.current?.type,
//           sdp: offer.current?.sdp
//         }
//       }
//       console.log("hi");
//       ioRef.current.send(chatMessage, name.id);
//       console.log("hi");

//     }
//     return

//   }

//   const onRename = (event: React.ChangeEvent<HTMLInputElement>): void => {
//     // this way we can use shownabove to read data from input box using ref and react change event
//     if (inputRef.current?.value !== null) {
//       setName(prev => ({ ...prev, UserName: inputRef.current?.value ?? '' }))
//     }


//   }

//   return (
//     <>
//       {name.alert && <Alert severity="success" color="info">
//         {"Enter a valid input !!"}
//       </Alert>}
//       <AppBar position="static">
//         <Toolbar variant="dense">
//           <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
//           </IconButton>
//           <Typography variant="h6" color="inherit" component="div">
//             Photos
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <Typography className='.MuiTypography-h2' >Enter Your Name</Typography>
//       <div className='format'>
//         <div className='console'>
//           <Avatar sx={{ bgcolor: deepPurple[500] }}>{name.UserName.charAt(0)}</Avatar>
//           <div>
//             Username: <Input type='text' inputRef={inputRef} onChange={onRename} disabled={name.Flag} />
//           </div>
//           <div>
//             <Button type='button' variant="outlined" onClick={onSubmitHandler} disabled={name.Flag}>Set Name</Button>
//             {/* <Button type='button' variant="outlined" disabled={!name.Flag || name.connected}>Connect</Button> */}
//             {/* <Button type='button' disabled={!name.connected} onClick={() => {
//               ioRef.current?.close()
//               setName(prevState => ({ ...prevState, connected: false }))
//             }} variant="outlined"  >Close Chat</Button> */}
//             <Button type='button' variant="outlined" onClick={onCall}>Call</Button>

//           </div>
//           <div>
//           </div>
//         </div>
//         <div style={{ border: '2px solid black', borderRadius: "10px" }}>
//           <h5 >Do you have any room id or create by providing by any  random number</h5>
//           <Input className='MuiInputLabel-outlined' type='text' inputRef={inputRefId} />
//           <Button disabled={!name.Flag || name.connected} type='button' variant="outlined" onClick={startChat}>Connect</Button>
//         </div>

//       </div>
//       <video ref={localRef} autoPlay muted={true} >video</video>
//       <video ref={remoteRef} autoPlay >video</video>
//       <Chat userMessages={messages} name={name.UserName} hide={false} />
//       {/* {ioRef.current && <VideoChat io={ioRef.current} username={name.UserName} ioId={name.id} />} */}
//       <div style={{ width: "60%", height: "55%", margin: "auto", justifyContent: 'center', }} hidden={!name.connected}>
//         <Input className='message' type='text' inputRef={inputRefMessage} />
//         <Button type='button' variant="outlined" onClick={sendMessage}>Send Message</Button>
//       </div>


//     </>
//   )
// }

// export default Socket1
