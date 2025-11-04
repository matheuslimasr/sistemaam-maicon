import React, { useState } from 'react'
import { Card, CardContent, Typography, Button, TextField, Box } from '@mui/material'
import KanbanCard from './KanbanCard'

export default function KanbanColumn({ columnId, title, cards, onAddCard, onMoveCard, columns }) {
  const [newCard, setNewCard] = useState('')

  return (
    <Card
      sx={{
        backgroundColor: '#f1f1f1',
        color: '#fff',
        borderRadius: 3,
        p: 1,
        minHeight: '70vh'
      }}
    >
      <CardContent>
        <Typography variant='subtitle1' fontWeight='bold'>
          {title}
        </Typography>

        {cards.map(card => (
          <KanbanCard key={card.id} card={card} currentColumn={columnId} onMoveCard={onMoveCard} columns={columns} />
        ))}

        <Box mt={2}>
          <TextField
            size='small'
            placeholder='Adicionar um cartão'
            value={newCard}
            onChange={e => setNewCard(e.target.value)}
            variant='outlined'
            fullWidth
            sx={{
              input: { color: 'black' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#555' }
              }
            }}
          />
          <Button
            sx={{ mt: 2, color: '#fff', backgroundColor: '#5465FF' }}
            onClick={() => {
              onAddCard(columnId, newCard)
              setNewCard('')
            }}
            fullWidth
            variant='contained'
          >
            + Adicionar
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
