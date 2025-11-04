// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// ** MUI Imports
import { Box, Card, CardHeader, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import ItemList from './ItemList'
import { useState } from 'react'

const Lista = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={12}>
          <Card>
            <CardHeader title='Produtos Cadastrados' />
            <ItemList />
          </Card>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Lista
