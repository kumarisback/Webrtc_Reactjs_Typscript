import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { homeUrl } from '../Url'
class WebSocketService1 {
  constructor(onMessageReceived) {
    this.stompClient = null
    this.connected = false
    this.onMessageReceived = onMessageReceived;
    this.data = null
    this.changeData = (data) => {
      this.data = data
    }
  }



  async connect(id) {
    const socket = new SockJS(homeUrl + '/entry/peerjs', null, {
    })

    this.stompClient = Stomp.over(socket)
    this.stompClient.debug = null
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${id}`, (message) => {
        this.onMessageReceived(message.body)
      })
    })
    this.connected = true
  }

  send(message, id) {
    if (!this.stompClient.connected) {
      console.log(
        'STOMP connection not established yet. ',
        message
      )
    } else {
      this.stompClient.send(`/app/peerjs/${id}`, {}, JSON.stringify({
        id: message.id,
        username: message.username,
        message: message.message,
        offer: message.offer
      }))
    }
  }

  changeData(data) {
    this.data = data;
  }

  close() {
    if (this.stompClient?.connected)
      this.stompClient.disconnect()
  }
}

export default WebSocketService1;
