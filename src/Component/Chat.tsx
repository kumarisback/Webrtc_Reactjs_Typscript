import { Input, Button } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { deepPurple } from '@mui/material/colors'
import React, { useEffect, useRef } from 'react'

interface Props {
  userMessages: any[],
  name: String,
  hide: boolean,
  receiver: any
}

const Chat = ({ userMessages, name, hide, receiver }: Props): JSX.Element => {

  const listRef = useRef<any>(null);
  const inputRefMessage = React.useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }
    , [userMessages]);
  const sendMessage = () => {
    if (inputRefMessage.current) {
      receiver(inputRefMessage.current?.value)
      inputRefMessage.current.value = ""
    }

    else {
      alert("Invalid input")
    }
  }
  return (
    <div style={{ visibility: hide ? "hidden" : "visible" }}>
      <List className='windowBox'  >
        {
          userMessages?.map((x, i) => {
            return (
              <ListItem key={i} style={{
                textAlign: name === x.username ? 'right' : 'left', display: 'flex',
                flexDirection: name === x.username ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                position: 'relative',
              }}
                ref={listRef}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: deepPurple[500] }}>{x.username.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={x.username}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >

                        {x.message}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>)
          }
          )
        }
      </List >
      <div style={{ justifyContent: 'center', width: "100%" }
      }   >
        <Input className='message' type='text' inputRef={inputRefMessage} />
        <Button type='button' variant="outlined" onClick={sendMessage}>Send Message</Button>

      </div>
    </div>

  )

}

export default Chat
