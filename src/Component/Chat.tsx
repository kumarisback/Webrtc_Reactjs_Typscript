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
  name: String
}

const Chat = ({ userMessages, name }: Props): JSX.Element => {

  const listRef = useRef<any>(null);

  useEffect(() => {
    if (listRef.current) {

      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }
    , [userMessages]);
  return (


    <List className='windowBox' style={{}}>

      {
        userMessages?.map((x, i) => {
          return (
            <ListItem key={i} ref={listRef} style={{
              textAlign: name === x.username ? 'right' : 'left', display: 'flex',
              flexDirection: name === x.username ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              width: "70%",
            }}
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

  )

}

export default Chat
