import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { homeUrl } from '../Url'
class WebSocketService {
  constructor(onMessageReceived) {
    this.stompClient = null
    this.connected = false
    this.onMessageReceived = onMessageReceived;
  }


  async connect(id) {
    const socket = new SockJS(homeUrl + '/entry')
    this.stompClient = Stomp.over(socket)
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
      this.stompClient.send(`/app/chat/${id}`, {}, JSON.stringify({
        id: 1,
        username: message.username,
        message: message.message
      }))
    }
  }

  close() {
    if (this.stompClient?.connected)
      this.stompClient.disconnect()
  }
}

export default WebSocketService;
