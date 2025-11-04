// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useAuth } from 'src/hooks/useAuth'
import FormBanner from './FormBanner'
import KanbanBoard from './components/KanbanBoard'
import { Typography } from '@mui/material'

const Categorias = () => {
  const { user } = useAuth()

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <Typography variant='h5' mb={5}>
            Minhas Tarefas
          </Typography>
          <KanbanBoard />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Categorias
