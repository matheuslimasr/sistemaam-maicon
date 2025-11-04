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
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { baseUrlApi } from 'src/configs/themeConfig'
import { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'
import { getDownloadURL, ref as refStorage, uploadBytes } from 'firebase/storage'
import { storageFirebaseConfig } from 'src/configs/firebase'
import ProgressLinearIndeterminate from 'src/views/components/progress/ProgressLinearIndeterminate'
import { InputLabel, MenuItem, Select } from '@mui/material'

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
  nomeProduto: yup.string().trim().required(),
  valorInicial: yup.string().required(),
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

  const [file, setFile] = useState()
  const [img, setImg] = useState('')

  const [emLeilao, setEmLeilao] = useState('2')

  const [loading, setLoading] = useState(true)
  const [load, setLoad] = useState(false)

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

  const onSubmit = (data: FormData) => {
    setLoad(true)

    let urlFoto = ''

    if (data.urlImage.trim() !== '') {
      urlFoto = data.urlImage
    } else if (img !== '') {
      urlFoto = img
    } else {
      urlFoto = ''
    }

    const formData = {
      nomeProduto: data.nomeProduto,
      informacoesAdicional: data.informacoesAdicional,
      referenciaProduto: data.referenciaProduto,
      valorInicial: data.valorInicial,
      tamanhoLamina: data.tamanhoLamina,
      expressura: data.expressura,
      materialLamina: data.materialLamina,
      materialCabo: data.materialCabo,
      urlImage: urlFoto,
      at_auction: emLeilao
    }

    fetch(`${baseUrlApi}/leilao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(response => {
      setLoad(false)
      reset()
      router.push({
        pathname: '/dashboard/leilao/lista'
      })
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

  return (
    <Card>
      <CardHeader title='Cadastro de produtos para leilão' />
      <CardContent>
        {load && (
          <>
            <ProgressLinearIndeterminate />
            <br />
            <br />
          </>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                {/* <UploadComponent setFile={setFile} /> */}
                {file ? <img src={file} alt='img' width={300} height='300' style={{ marginBottom: 20 }} /> : <br />}
                <input type='file' onChange={handleUploadImage} />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='urlImage'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='URL EXTERNA DA INTERNET(LINK)'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.urlImage)}
                      placeholder='URL EXTERNA DA INTERNET(LINK)'
                    />
                  )}
                />
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

export default FormProdutos
