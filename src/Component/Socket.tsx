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


// // socket only
// const Socket1: React.FC = () => {
//   const inputRef = React.useRef<HTMLInputElement>()
//   const inputRefId = React.useRef<HTMLInputElement>()
//   const inputRefMessage = React.useRef<HTMLInputElement>(null)
//   const ioRef = useRef<WebSocketService>();
//   const [messages, setMessage] = useState<any[]>([]);
//   const [name, setName] = useState<State>({ UserName: '', Flag: false, alert: false, connected: false, id: 1 })



//   const onMessageReceived = async (message: any): Promise<void> => {
//     setMessage(prev => ([...prev, JSON.parse(JSON.parse(message).body)]));
//   };

//   useEffect(() => {
//     async function fetchData() {
//       ioRef.current = new WebSocketService(onMessageReceived);
//     }
//     fetchData();

//   }, []);


//   const onSubmitHandler = async (): Promise<void> => {
//     if (name.UserName === '') {
//       setName(prevState => ({ ...prevState, alert: true }))
//       return
//     }
//     setName(prevState => ({ ...prevState, UserName: name.UserName, Flag: true, id: 1 }))
//   }

//   const startChat = async (): Promise<void> => {
//     await ioRef.current?.connect(name.id);
//     setName(prevState => ({ ...prevState, connected: true }))
//   }

//   const sendMessage = async (): Promise<void> => {

//     if (inputRefMessage.current !== null)
//       if (ioRef.current) {
//         const chatMessage = {
//           id: name.id,
//           username: name.UserName,
//           message: inputRefMessage.current?.value
//         }
//         ioRef.current.send(chatMessage, name.id);
//         inputRefMessage.current.value = '';
//       }
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
//             <Button type='button' onClick={startChat} variant="outlined" disabled={!name.Flag || name.connected}>Connect</Button>
//             <Button type='button' disabled={!name.connected} onClick={() => {
//               ioRef.current?.close()
//               setName(prevState => ({ ...prevState, connected: false }))
//             }} variant="outlined"  >Close Chat</Button>

//           </div>
//           <div>
//           </div>
//         </div>
//         <div style={{ border: '2px solid black', borderRadius: "10px" }}>
//           <h3 >Do you have any room id or create by providing by any  random number</h3>
//           <Input className='MuiInputLabel-outlined' type='text' inputRef={inputRefId} />
//           <Button type='button' variant="outlined" onClick={() => {
//             setName(prevState => ({ ...prevState, id: inputRefId.current?.value }))
//           }}>Submit</Button>
//         </div>

//       </div>
//       <Chat userMessages={messages} name={name.UserName} hide={false} />
//       <div style={{ width: "60%", height: "55%", margin: "auto", justifyContent: 'center', }} hidden={!name.connected}>
//         <Input className='message' type='text' inputRef={inputRefMessage} />
//         <Button type='button' variant="outlined" onClick={sendMessage}>Send Message</Button>
//       </div>

//     </>
//   )
// }

// export default Socket1
