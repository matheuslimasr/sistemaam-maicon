// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { ref, update } from 'firebase/database'

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
import { useEffect, useState } from 'react'
import { baseUrlApi } from 'src/configs/themeConfig'
import { useRouter } from 'next/router'

const schema = yup.object().shape({
  nomeCategoria: yup.string().required('Campo precisa ser preenchido').trim('Campo em Branco!')
})

interface FormData {
  nomeCategoria: string
}

const defaultValues = {
  nomeCategoria: ''
}

const FormCategoria = ({ user }) => {
  const router = useRouter()
  const [dataDb, setDataDb] = useState()
  const [load, setLoad] = useState(true)

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

  const getCollection = async () => {
    await fetch(`${baseUrlApi}/categorias/${router.query.uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(dataItem => {
        setDataDb(dataItem[0])
        setLoad(false)
      })
    })
  }

  useEffect(() => {
    getCollection()
  })

  const onSubmit = (data: FormData) => {
    const { nomeCategoria } = data

    const dataForm = {
      categoria: nomeCategoria ? nomeCategoria : dataDb.nomeCategoria_categorias
    }

    fetch(`${baseUrlApi}/categorias/${router.query.uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForm)
    }).then(response => {
      reset()
      router.push({
        pathname: '/dashboard/categorias/lista'
      })
    })
  }

  if (load) {
    return <h5>Carregando...</h5>
  } else {
    return (
      <Card>
        <CardHeader title={'Editar: '} />

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='nomeCategoria'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Novo Nome da Categoria'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.nomeCategoria)}
                        placeholder='Nome categoria'
                      />
                    )}
                  />
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Nome atual:</strong>{' '}
                  {dataDb?.nomeCategoria_categorias != '' ? dataDb?.nomeCategoria_categorias : 'NÃO INFORMADO'}
                </p>
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
                    SALVAR MUDANÇA
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    )
  }
}

export default FormCategoria
