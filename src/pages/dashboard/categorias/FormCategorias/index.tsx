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
import { databaseFirebaseConfig } from 'src/configs/firebase'
import { UserDataType } from 'src/context/types'
import { useRouter } from 'next/router'
import { baseUrlApi } from 'src/configs/themeConfig'

const defaultValues = {
  nomeCategoria: ''
}

const schema = yup.object().shape({
  nomeCategoria: yup.string().required('Campo precisa ser preenchido').trim('Campo em Branco!')
})

interface User {
  user: UserDataType
}

interface FormData {
  nomeCategoria: string
}

const FormVendas = ({ user }: User) => {
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
    const { nomeCategoria } = data

    const dataForm = {
      categoria: nomeCategoria
    }

    await fetch(`${baseUrlApi}/categorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForm)
    }).then(response => {
      window.alert('Categoria Salva!')
      router.push({
        pathname: '/dashboard/categorias/lista'
      })
    })
  }

  return (
    <Card>
      <CardHeader title='Cadastro de Categorias' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* FORM INPUTS INICIO */}

            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='nomeCategoria'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Nome da Categoria'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.nomeCategoria)}
                      placeholder='Nome categoria'
                    />
                  )}
                />
              </FormControl>
            </Grid>

            {/* FORM INPUTS FIM */}

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

export default FormVendas
