// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// ** Third Party Imports
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
import { useAuth } from 'src/hooks/useAuth'
import { child, get, getDatabase, push, ref, ref as RefDatabase, update } from 'firebase/database'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { baseUrlApi } from 'src/configs/themeConfig'

interface FormData {
  nomeProduto: string
  referenciaProduto: string
  informacoesAdicional: string
}

const schema = yup.object().shape({
  nomeProduto: yup.string().trim(),
  referenciaProduto: yup.string().trim(),
  informacoesAdicional: yup.string().trim()
})

const defaultValues = {
  nomeProduto: '',
  referenciaProduto: '',
  informacoesAdicional: ''
}

const FormProdutos = () => {
  const { user } = useAuth()
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
    await fetch(`${baseUrlApi}/produtos/${router.query.uid}`, {
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
    const formData = {
      nomeProduto_produtos: data.nomeProduto ? data.nomeProduto : dataDb.nomeProduto_produtos,
      referenciaProduto_produtos: data.referenciaProduto ? data.referenciaProduto : dataDb.referenciaProduto_produtos,
      informacoesAdicional_produtos: data.informacoesAdicional
        ? data.informacoesAdicional
        : dataDb.informacoesAdicional_produtos
    }

    fetch(`${baseUrlApi}/produtos/${router.query.uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(response => {
      reset()

      router.push({
        pathname: '/dashboard/produtos/lista'
      })
    })
  }

  if (load) {
    return <h1>Carregando....</h1>
  } else {
    return (
      <Card>
        <CardHeader title='Editar: ' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='nomeProduto'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Nome do Produto'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.nomeProduto)}
                        placeholder='Nome do Produto'
                      />
                    )}
                  />
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Nome Produto:</strong>{' '}
                  {dataDb.nomeProduto_produtos != '' ? dataDb.nomeProduto_produtos : 'NÃO INFORMADO'}
                </p>
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='referenciaProduto'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Referência do Produto (opcional)'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.referenciaProduto)}
                        placeholder='0000000000'
                      />
                    )}
                  />
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Referência do Produto:</strong>{' '}
                  {dataDb.referenciaProduto_produtos != '' ? dataDb.referenciaProduto_produtos : 'NÃO INFORMADO'}
                </p>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='informacoesAdicional'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        rows={4}
                        multiline
                        id='textarea-filled'
                        label='Informações Adicionais'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.informacoesAdicional)}
                        placeholder='Informações Adicionais'
                      />
                    )}
                  />
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Informações Adicionais:</strong>{' '}
                  {dataDb.informacoesAdicional_produtos != '' ? dataDb.informacoesAdicional_produtos : 'NÃO INFORMADO'}
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
}

export default FormProdutos
