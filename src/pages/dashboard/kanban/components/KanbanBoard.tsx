import React, { useState } from 'react'
import { Grid, Typography } from '@mui/material'
import KanbanColumn from './KanbanColumn'

const initialData = {
  'em-aberto': {
    title: 'EM ABERTO',
    cards: [{ id: '1', content: 'Planejar nova funcionalidade' }]
  },
  'em-andamento': {
    title: 'EM ANDAMENTO',
    cards: [{ id: '2', content: 'Desenvolver componente de Login' }]
  },
  revisoes: {
    title: 'REVISÕES',
    cards: []
  },
  finalizado: {
    title: 'FINALIZADO',
    cards: [
      { id: '2', content: 'Desenvolver componente de Login 1' },
      { id: '2', content: 'Desenvolver componente de Login 2' },
      { id: '2', content: 'Desenvolver componente de Login 3' },
      { id: '2', content: 'Desenvolver componente de Login 4' }
    ]
  }
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData)

  const handleAddCard = (columnId, content) => {
    if (!content) return
    const newCard = { id: Date.now().toString(), content }
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        cards: [...prev[columnId].cards, newCard]
      }
    }))
  }

  const handleMoveCard = (fromColumn, toColumn, cardId) => {
    const card = columns[fromColumn].cards.find(c => c.id === cardId)
    if (!card) return
    setColumns(prev => ({
      ...prev,
      [fromColumn]: {
        ...prev[fromColumn],
        cards: prev[fromColumn].cards.filter(c => c.id !== cardId)
      },
      [toColumn]: {
        ...prev[toColumn],
        cards: [...prev[toColumn].cards, card]
      }
    }))
  }

  return (
    <Grid container spacing={2}>
      {Object.entries(columns).map(([columnId, column]) => (
        <Grid item xs={12} sm={6} md={3} key={columnId}>
          <KanbanColumn
            columnId={columnId}
            title={column.title}
            cards={column.cards}
            onAddCard={handleAddCard}
            onMoveCard={handleMoveCard}
            columns={columns}
          />
        </Grid>
      ))}
    </Grid>
  )
}
