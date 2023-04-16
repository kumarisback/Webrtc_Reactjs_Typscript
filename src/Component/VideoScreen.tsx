import Peer, { DataConnection, MediaConnection } from 'peerjs';
import React, { useEffect, useRef } from 'react'

type Props = {}

// const peer = new Peer({
//     'host': 'localhost',
//     'port': 8080,
//     'path': '/entry',
// });

const VideoScreen = (props: Props) => {

    const ref1 = useRef<HTMLVideoElement>(null);
    const ref2 = useRef<HTMLVideoElement>(null);
    let id1;
    let id2;
    let peer: Peer;
    let peer2: Peer;
    let call;
    let conn: DataConnection;

    const startConnection1 = () => {
        peer = new Peer("arun", {
            'host': 'localhost',
            'port': 8080,
            'path': '/entry',
        });
        console.log(peer);

        const conn = peer.connect("avtar");
        console.log(conn);
        conn.on("open", () => {
            conn.send("hi!");
        });
        peer.on("connection", (conn) => {
            conn.on("data", (data) => {
                // Will print 'hi!'
                console.log(data);
            });
            conn.on("open", () => {
                conn.send("hello!");
            });
        });
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        });

        peer.on('connection', (conn) => {
            console.log('Received a new data connection');
        });

        peer.on('call', (call) => {
            console.log('Received a new call');
        });
        navigator.mediaDevices.getUserMedia(
            { video: true, audio: true }).then(
                (stream: MediaStream) => {
                    call = peer.call("avtar", stream);
                    call.on("stream", (remoteStream) => {
                        if (ref1.current) {
                            ref1.current.srcObject = remoteStream;
                        }
                    });
                }).catch((err) => {
                    console.error("Failed to get local stream", err);
                });


        peer.on("call", (call) => {
            navigator.mediaDevices.getUserMedia
                ({ video: true, audio: true }).then((stream: MediaStream) => {
                    console.log("remoteStream");
                    call.answer(stream); // Answer the call with an A/V stream.
                    call.on("stream", (remoteStream) => {
                        console.log(remoteStream);

                        if (ref2.current) {
                            console.log("remoteStream2");
                            ref2.current.srcObject = remoteStream;
                        }
                    });
                }).catch((err) => {
                    console.log(err);

                })
        })
    }
    const startConnection2 = () => {
        peer2 = new Peer("avtar", {
            'host': 'localhost',
            'port': 8080,
            'path': '/entry',
        });
        console.log(peer2);

        const conn = peer2.connect("arun");
        console.log(conn);

        conn.on("open", () => {
            conn.send("hi!");
        });
        peer2.on("connection", (conn) => {
            conn.on("data", (data) => {
                console.log(data);
            });
            conn.on("open", () => {
                conn.send("hello!");
            });
        });
        navigator.mediaDevices.getUserMedia(
            { video: true, audio: true }).then(
                (stream: MediaStream) => {
                    call = peer2.call("arun", stream);
                    call.on("stream", (remoteStream) => {
                        if (ref1.current) {
                            ref1.current.srcObject = remoteStream;
                        }
                    });
                }).catch((err) => {
                    console.error("Failed to get local stream", err);
                });


        peer2.on("call", (call) => {
            navigator.mediaDevices.getUserMedia
                ({ video: true, audio: true }).then((stream: MediaStream) => {
                    call.answer(stream); // Answer the call with an A/V stream.
                    call.on("stream", (remoteStream) => {
                        if (ref2.current) {
                            ref2.current.srcObject = remoteStream;
                        }
                    });
                }).catch((err) => {
                    console.log(err);

                })
        })
    }

    return (
        <div>
            <button onClick={startConnection1}>arun</button>
            <button onClick={startConnection2}>avtar</button>
            {/* <button onClick={startConnection} >Connect</button> */}
            <video ref={ref1} />
            <video ref={ref2} />
        </div>
    )
}

export default VideoScreen