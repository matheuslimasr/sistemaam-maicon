import React from 'react'
import { Card, CardContent, Typography, Menu, MenuItem, IconButton } from '@mui/material'

export default function KanbanCard({ card, currentColumn, onMoveCard, columns }) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleMenu = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleMove = targetColumn => {
    onMoveCard(currentColumn, targetColumn, card.id)
    handleClose()
  }

  return (
    <Card
      sx={{
        mt: 1,
        backgroundColor: '#c7d0ff',
        color: 'white',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        mb: 2
      }}
    >
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='body2'>{card.content}</Typography>
        <IconButton size='small' onClick={handleMenu} sx={{ color: 'white' }}>
          {/* <MoreVertIcon fontSize='small' /> */}
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {Object.keys(columns)
            .filter(id => id !== currentColumn)
            .map(id => (
              <MenuItem key={id} onClick={() => handleMove(id)}>
                Mover para {columns[id].title}
              </MenuItem>
            ))}
        </Menu>
      </CardContent>
    </Card>
  )
}
