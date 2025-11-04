// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import FormFormaPagamento from './FormFormaPagamento'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

const FormadePagamentos = () => {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={6}>
          <FormFormaPagamento dadosAtual={router.query} user={user} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default FormadePagamentos
