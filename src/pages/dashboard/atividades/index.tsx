// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useAuth } from 'src/hooks/useAuth'
import FormBanner from './FormBanner'
import KanbanBoard from './components/KanbanBoard'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import TableStickyHeader from 'src/views/table/mui/TableStickyHeader'

const Categorias = () => {
  const { user } = useAuth()

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='Últimas Atividades' />
            <CardContent>
              <TableStickyHeader />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Categorias
