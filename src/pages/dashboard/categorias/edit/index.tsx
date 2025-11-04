// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import FormCategorias from './FormCategorias'
import { useAuth } from 'src/hooks/useAuth'

const Edit = () => {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={6}>
          <FormCategorias dadosAtual={router.query} user={user} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Edit
