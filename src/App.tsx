import React from 'react'
import './App.css'
// import VideoCall from './Component/VideoCall'
// import Socket from './Component/Socket'
import ScreenShare from './Component/ScreenShare'

const App: React.FC = () => {

  return (
    <div className="App">
      {/* <Socket />      socket only use case */}
      {/* <Socket1 />   video call with socket but no css styling  */}
      <ScreenShare />
      {/* <VideoCall />  direact call on message send with only connect to two people no group or other use case */}
      {/* <VideoChat />    no use  */}

    </div>
  )
}

export default App
