// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// ** MUI Imports
import { Card, CardHeader } from '@mui/material'
import Grid from '@mui/material/Grid'

import ItemList from './ItemList'

const Lista = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6} lg={12}>
        <Card>
          <CardHeader title='Vendas Cadastradas' />
          <ItemList />
        </Card>
      </Grid>
    </Grid>
  )
}

export default Lista
