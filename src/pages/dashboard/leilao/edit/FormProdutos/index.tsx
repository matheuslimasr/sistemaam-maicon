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
import { InputLabel, MenuItem, Select } from '@mui/material'

import { v4 as uuidv4 } from 'uuid'
import { getDownloadURL, ref as refStorage, uploadBytes } from 'firebase/storage'
import { storageFirebaseConfig } from 'src/configs/firebase'
import ProgressLinearIndeterminate from 'src/views/components/progress/ProgressLinearIndeterminate'

interface FormData {
  nomeProduto: string
  valorInicial: string
  tamanhoLamina: string
  expressura: string
  materialLamina: string
  materialCabo: string
  referenciaProduto: string
  informacoesAdicional: string
  urlImage: string
}

const schema = yup.object().shape({
  nomeProduto: yup.string().trim(),
  valorInicial: yup.string(),
  tamanhoLamina: yup.string(),
  materialLamina: yup.string(),
  materialCabo: yup.string(),
  expressura: yup.string(),
  referenciaProduto: yup.string().trim(),
  informacoesAdicional: yup.string().trim(),
  urlImage: yup.string().trim()
})

const defaultValues = {
  nomeProduto: '',
  valorInicial: '',
  tamanhoLamina: '',
  expressura: '',
  materialLamina: '',
  materialCabo: '',
  referenciaProduto: '',
  informacoesAdicional: '',
  urlImage: ''
}

const FormProdutos = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [dataDb, setDataDb] = useState()
  const [load, setLoad] = useState(true)

  const [file, setFile] = useState()
  const [img, setImg] = useState('')

  const [emLeilao, setEmLeilao] = useState('2')

  const [loading, setLoading] = useState(false)

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
    await fetch(`${baseUrlApi}/leilao/${router.query.uid}`, {
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
    setLoading(true)
    let urlFoto = ''

    if (data.urlImage.trim() !== '') {
      urlFoto = data.urlImage
    } else if (img !== '') {
      urlFoto = img
    } else {
      urlFoto = ''
    }

    const formData = {
      nomeProduto: data.nomeProduto ? data.nomeProduto : dataDb.nomeProduto,
      valorInicial: data.valorInicial ? data.valorInicial : dataDb.valorInicial,
      tamanhoLamina: data.tamanhoLamina ? data.tamanhoLamina : dataDb.tamanhoLamina,
      expressura: data.expressura ? data.expressura : dataDb.expressura,
      materialLamina: data.materialLamina ? data.materialLamina : dataDb.materialLamina,
      materialCabo: data.materialCabo ? data.materialCabo : dataDb.materialCabo,
      urlImage: urlFoto ? urlFoto : dataDb.urlImage,
      referenciaProduto: data.referenciaProduto ? data.referenciaProduto : dataDb.referenciaProduto,
      informacoesAdicional: data.informacoesAdicional ? data.informacoesAdicional : dataDb.informacoesAdicional,
      at_auction: emLeilao ? emLeilao : dataDb.at_auction
    }

    fetch(`${baseUrlApi}/leilao/${router.query.uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(response => {
      alert('Dados atualizado com sucesso!')
      setLoading(false)
    })
  }

  const handleUploadImage = file => {
    const data = new FileReader()

    data.addEventListener('load', () => {
      setFile(data.result)
    })

    data.readAsDataURL(file.target.files[0])

    const imageRef = refStorage(storageFirebaseConfig, `Files/${user.id}/leilao/${uuidv4()}.png`)
    uploadBytes(imageRef, file.target.files[0]).then(snapshot => {
      getDownloadURL(snapshot.ref).then(url => {
        setImg(url)
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
          {loading && (
            <>
              <ProgressLinearIndeterminate />
              <br />
              <br />
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              {dataDb?.urlImage && (
                <Grid item xs={12} md={12} lg={12}>
                  <InputLabel id='demo-simple-select-outlined-label'>FOTO ATUAL:</InputLabel>
                  <FormControl fullWidth>
                    {dataDb?.urlImage ? <img src={dataDb.urlImage} alt='img' width={200} height='auto' /> : <br />}
                  </FormControl>
                </Grid>
              )}

              {dataDb?.urlImage && (
                <InputLabel id='demo-simple-select-outlined-label'>
                  -------------------------------------------------------------------
                </InputLabel>
              )}

              <Grid item xs={12} md={12} lg={12}>
                <InputLabel id='demo-simple-select-outlined-label'>FOTO NOVA:</InputLabel>
                <FormControl fullWidth>
                  {file ? <img src={file} alt='img' width={300} height='300' style={{ marginBottom: 30 }} /> : <br />}
                  <input type='file' onChange={handleUploadImage} />
                </FormControl>
              </Grid>

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
                  <strong>Nome Produto:</strong> {dataDb?.nomeProduto != '' ? dataDb.nomeProduto : 'NÃO INFORMADO'}
                </p>
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='valorInicial'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Valor inicial'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.valorInicial)}
                        placeholder='Valor inicial'
                      />
                    )}
                  />
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Valor inicial:</strong> {dataDb?.valorInicial != '' ? dataDb.valorInicial : 'NÃO INFORMADO'}
                </p>
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='tamanhoLamina'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Tamanho da lâmina'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.tamanhoLamina)}
                        placeholder='Tamanho da lâmina'
                      />
                    )}
                  />
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Tamanho da lâmina:</strong>{' '}
                  {dataDb?.tamanhoLamina != '' ? dataDb.tamanhoLamina : 'NÃO INFORMADO'}
                </p>
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='expressura'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Espessura'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.expressura)}
                        placeholder='Espessura'
                      />
                    )}
                  />
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Espessura:</strong> {dataDb?.expressura != '' ? dataDb.expressura : 'NÃO INFORMADO'}
                </p>
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='materialLamina'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Material da lâmina'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.materialLamina)}
                        placeholder='Material da lâmina'
                      />
                    )}
                  />
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Material da lâmina:</strong>{' '}
                  {dataDb?.materialLamina != '' ? dataDb.materialLamina : 'NÃO INFORMADO'}
                </p>
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='materialCabo'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Material do Cabo'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.materialCabo)}
                        placeholder='Material do Cabo'
                      />
                    )}
                  />
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Material do Cabo:</strong>{' '}
                  {dataDb?.materialCabo != '' ? dataDb.materialCabo : 'NÃO INFORMADO'}
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
                  {dataDb?.referenciaProduto != '' ? dataDb.referenciaProduto : 'NÃO INFORMADO'}
                </p>
              </Grid>

              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label'>Em leião?</InputLabel>
                  <Select
                    label='Em leião?'
                    defaultValue={emLeilao}
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    fullWidth
                    onChange={value => {
                      setEmLeilao(value.target.value)
                    }}
                  >
                    <MenuItem value={2}>SIM</MenuItem>
                    <MenuItem value={3}>NÃO</MenuItem>
                  </Select>
                </FormControl>
                <p style={{ padding: 0, margin: 0 }}>
                  <strong>Referência do Produto:</strong>{' '}
                  {dataDb?.at_auction === 2 ? 'EM LEILÃO' : 'NÃO ESTA EM LEILÃO'}
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
                  {dataDb?.informacoesAdicional != '' ? dataDb.informacoesAdicional : 'NÃO INFORMADO'}
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
