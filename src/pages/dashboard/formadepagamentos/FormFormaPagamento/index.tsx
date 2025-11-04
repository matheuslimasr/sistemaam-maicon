// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import { UserDataType } from 'src/context/types'
import { useRouter } from 'next/router'
import { baseUrlApi } from 'src/configs/themeConfig'

const defaultValues = {
  nomeFormaDePagamento: ''
}

const schema = yup.object().shape({
  nomeFormaDePagamento: yup.string().trim().required('Campo precisa ser preenchido').trim('Campo em Branco!')
})

interface FormData {
  nomeFormaDePagamento: string
}

interface User {
  user: UserDataType
}

const FormFormaPagamento = ({ user }: User) => {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const { nomeFormaDePagamento } = data

    const dataForm = {
      formasDePagamentos: nomeFormaDePagamento
    }

    await fetch(`${baseUrlApi}/formasdepagamento`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForm)
    }).then(response => {
      reset()

      router.push({
        pathname: '/dashboard/formadepagamentos/lista'
      })
    })
  }

  return (
    <Card>
      <CardHeader title='Cadastro de Formas de Pagamentos' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='nomeFormaDePagamento'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Forma de Pagamento'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.nomeFormaDePagamento)}
                      placeholder='Forma de Pagamento'
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button type='submit' variant='contained' size='large'>
                  SALVAR
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormFormaPagamento
