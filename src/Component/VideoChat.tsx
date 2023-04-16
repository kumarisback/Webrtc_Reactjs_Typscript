import React, { useState, useEffect, useRef } from 'react'
import WebSocketService from '../Service/sockitservice1'

interface VideoCallProps {
    io: WebSocketService;
    username: string;
    ioId: number
}

const VideoCall: React.FC<VideoCallProps> = ({ io, username, ioId }) => {


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
    const localStream = useRef<MediaStream | null>(null);
    const localRef = useRef<HTMLVideoElement>(null)
    const remoteRef = useRef<HTMLVideoElement>(null)
    const peerConnection = React.useRef<RTCPeerConnection>();
    const offer = useRef<RTCSessionDescriptionInit>()
    const ioRef = useRef<WebSocketService>(io);


    // const onMessageReceived = async (message: any): Promise<void> => {
    //     try {

    //         let data = JSON.parse(JSON.parse(message).body);

    //         if (data.offer.type === "answer" && ) {
    //             console.log("answer coming");
    //             const remoteDesc = new RTCSessionDescription(data.offer);
    //             if (peerConnection.current)
    //                 await peerConnection.current?.setRemoteDescription(remoteDesc);

    //         }
    //         else if (data.offer.type === "offer" && ) {
    //             peerConnection.current?.setRemoteDescription(new RTCSessionDescription((data.offer)));
    //             const answer = await peerConnection.current?.createAnswer();
    //             await peerConnection.current?.setLocalDescription(answer);

    //             const chatMessage = {
    //                 id: ,
    //                 username: ,
    //                 offer: {
    //                     type: answer?.type,
    //                     sdp: answer?.sdp
    //                 }
    //             }
    //             await ioRef.current?.send(chatMessage, 1);


    //         }
    //         else if (data.offer.type === "new-ice-candidate" && ) {
    //             peerConnection.current?.addIceCandidate(JSON.parse(data.offer.sdp))
    //         };
    //     } catch (error) {
    //         console.log(error);

    //     }


    // }

    useEffect(() => {
        async function fetchData() {
            try {

                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    if (localStream && localRef.current) {
                        localRef.current.srcObject = localStream.current
                    }
                    peerConnection.current = new RTCPeerConnection(configuration)
                    for (const track of localStream.current.getTracks()) {
                        peerConnection.current.addTrack(track, localStream.current);
                    }
                } else {
                    console.log(navigator);
                }
                if (peerConnection.current) {
                    peerConnection.current.onicecandidate = (event) => {
                        console.log(event.candidate);

                        if (event.candidate) {
                            // Send the ICE candidate to the remote peer
                            const chatMessage = {
                                id: ioId,
                                username: username,
                                message: "",
                                offer: {
                                    type: "new-ice-candidate",
                                    sdp: JSON.stringify(event.candidate)
                                }
                            }
                            if (ioRef.current)
                                ioRef.current.send(chatMessage, ioId);
                        }
                    }

                    peerConnection.current.addEventListener('track', async (event) => {
                        console.log("remote stream");

                        const [remoteStream] = event.streams;
                        if (remoteRef.current)
                            remoteRef.current.srcObject = remoteStream;
                    });

                    peerConnection.current.addEventListener('connectionstatechange', event => {
                        if (peerConnection.current && peerConnection.current.connectionState === 'connected') {
                            console.log("conneted");

                        }
                    });
                }


            } catch (error) {
                console.log(error);

            }
        }
        fetchData();

    }, []);


    useEffect(() => {
        if (!peerConnection.current) {
            return;
        }
        peerConnection.current.ontrack = ({ track, streams }) => {
            track.onunmute = () => {
                if (remoteRef.current && !remoteRef.current.srcObject) {
                    remoteRef.current.srcObject = streams[0];
                }
            };
        };
    }, [peerConnection]);


    // const sendMessage = async (): Promise<void> => {

    //     offer.current = await peerConnection.current?.createOffer({ iceRestart: true });
    //     await peerConnection.current?.setLocalDescription(offer.current);

    //     if (ioRef.current?.stompClient?.connected)
    //         if (ioRef.current) {
    //             const chatMessage = {
    //                 id: ,
    //                 username: ,
    //                 offer: {
    //                     type: offer.current?.type,
    //                     sdp: offer.current?.sdp
    //                 }
    //             }
    //             ioRef.current.send(chatMessage,);
    //         }
    // }


    return (
        <>

            <video ref={localRef} autoPlay muted={true} >video</video>
            <video ref={remoteRef} autoPlay >video</video>

        </>
    )
}

export default VideoCall
