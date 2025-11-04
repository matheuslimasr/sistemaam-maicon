// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useEffect, useState } from 'react'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { v4 as uuidv4 } from 'uuid'
import { getDownloadURL, ref as refStorage, uploadBytes } from 'firebase/storage'
import { storageFirebaseConfig } from 'src/configs/firebase'

// ** MUI Imports
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'

// ** Icon Imports
import Select from '@mui/material/Select'
import { Alert, Divider, ListItem, ListItemText, MenuItem, Typography, useTheme } from '@mui/material'
import { UserDataType } from 'src/context/types'
import Calendario from './Calendario'
import { useRouter } from 'next/router'
import { baseUrlApi } from 'src/configs/themeConfig'
import ProgressLinearIndeterminate from 'src/views/components/progress/ProgressLinearIndeterminate'

const defaultValues = {
  custoProduto: '',
  custoEnvio: '',
  valorVenda: '',
  codigoRastreio: '',
  informacoesAdicional: '',
  length: '20',
  width: '6',
  height: '3',
  distance_unit: 'in',
  weight: '',
  mass_unit: 'lb',
  urlImage: ''
}

const schema = yup.object().shape({
  custoProduto: yup.string().trim(),
  custoEnvio: yup.string().trim(),
  valorVenda: yup.string().trim(),
  codigoRastreio: yup.string().trim(),
  informacoesAdicional: yup.string().trim()
})

interface User {
  user: UserDataType
}

interface FormData {
  custoProduto: string
  custoEnvio: string
  valorVenda: string
  codigoRastreio: string
  informacoesAdicional: string
  length: number
  width: number
  height: number
  distance_unit: string
  weight: number
  mass_unit: string
  urlImage: string
}

const FormVendas = ({ user }: User) => {
  const router = useRouter()
  const [dataDb, setDataDb] = useState()
  const [load, setLoad] = useState(true)
  const [loading, setLoading] = useState(false)

  const [length, setLength] = useState('20')
  const [width, setWidth] = useState('6')
  const [height, setHeight] = useState('3')
  const [distance_unit, setDistanceUnit] = useState('in')
  const [weight, setWeight] = useState('')
  const [mass_unit, setMassUnit] = useState('lb')

  const [rates, setRates] = useState({})
  const [rateSelected, setRateSelected] = useState('Priority Mail')
  const [freteSelected, setFreteSelected] = useState({})

  const [respVenda, setRespVenda] = useState([] as any)
  const [isLabel, setIsLabel] = useState('NAO')

  const [searchProduct, setSearchProduct] = useState('')
  const [searchClient, setSeatchClient] = useState('')

  const [listCategorias, setListCategorias] = useState([])
  const [fpag, setFPag] = useState([])
  const [cliente, setCliente] = useState([] as any)
  const [produto, setProduto] = useState([] as any)

  // ** States
  const [date, setDate] = useState<DateType>('')

  const theme = useTheme()

  const [file, setFile] = useState()
  const [img, setImg] = useState('')

  const [fieldProduto, setFieldProduto] = useState('')
  const [fieldCategoria, setFieldCategoria] = useState('')
  const [fieldFpag, setFieldFpag] = useState('')
  const [fieldStatus, setFieldStatus] = useState('')
  const [fieldCliente, setFieldCliente] = useState('')

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const searchAndgetProduto = async () => {
    let queryParams = ''

    if (searchProduct !== '') {
      queryParams = `${baseUrlApi}/produtos?nomeProduto_produtos=${searchProduct}&limit=999999`
    } else {
      queryParams = `${baseUrlApi}/produtos`
    }

    fetch(queryParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(dataItem => {
        setProduto(dataItem)
        setLoad(false)
      })
    })
  }

  const searchAndGetCliente = async () => {
    let queryParams = ''

    if (searchClient !== '') {
      queryParams = `${baseUrlApi}/clientes?nomeCliente_clientes=${searchClient}&limit=9999999`
    } else {
      queryParams = `${baseUrlApi}/clientes`
    }

    fetch(queryParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(dataItem => {
        setCliente(dataItem)
      })
    })
  }

  const getCollection = async () => {
    fetch(`${baseUrlApi}/vendas/${router.query.uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(dataItem => {
        setDataDb(dataItem[0])
      })
    })

    setLoad(false)
  }

  const getCategoria = async () => {
    fetch(`${baseUrlApi}/categorias`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(dataItem => {
        setListCategorias(dataItem)
      })
    })
  }

  const getFPag = async () => {
    fetch(`${baseUrlApi}/formasdepagamento`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      response.json().then(dataItem => {
        setFPag(dataItem)
      })
    })
  }

  useEffect(() => {
    searchAndGetCliente()
  }, [searchClient])

  useEffect(() => {
    searchAndgetProduto()
  }, [searchProduct])

  useEffect(() => {
    getCategoria()
    getFPag()
    getCollection()
  }, [])

  const convertDate = str => {
    str = str.toString()
    let parts = str.split(' ')
    let months = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12'
    }
    return parts[3] + '-' + months[parts[1]] + '-' + parts[2]
  }

  function formatData(param) {
    const datax = param
    const dd = datax.split('/')
    let value = ''

    if (dd[0] === '0') {
      value = `1/${dd[1]}/${dd[2]}`
    } else {
      value = datax
    }

    return value
  }

  const handleUploadImage = file => {
    const data = new FileReader()

    data.addEventListener('load', () => {
      setFile(data.result)
    })

    data.readAsDataURL(file.target.files[0])

    const imageRef = refStorage(storageFirebaseConfig, `Files/${user.id}/${uuidv4()}.png`)
    uploadBytes(imageRef, file.target.files[0]).then(snapshot => {
      getDownloadURL(snapshot.ref).then(url => {
        setImg(url)
      })
    })
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    let dataVenda = ''

    if (date?.toString().trim() !== '') {
      dataVenda = `${convertDate(date)}`
    } else {
      dataVenda = ''
    }

    const uid = router.query.uid

    let formData = {}

    if (isLabel == 'SIM') {
      formData = {
        photo_vendas: img ? img : dataDb.photo_vendas,
        produto_vendas: fieldProduto?.target?.value ? JSON.parse(fieldProduto?.target?.value) : dataDb.produto_vendas,
        categoria_vendas: fieldCategoria?.target?.value ? fieldCategoria.target.value : dataDb.categoria_vendas,
        formaPagamento_vendas: fieldFpag?.target?.value ? fieldFpag?.target?.value : dataDb.formaPagamento_vendas,
        status_vendas: fieldStatus?.target?.value ? fieldStatus?.target?.value : dataDb.status_vendas,
        cliente_vendas: fieldCliente?.target?.value ? JSON.parse(fieldCliente?.target?.value) : dataDb.cliente_vendas,
        custoProduto_vendas: data.custoProduto ? data.custoProduto : dataDb.custoProduto_vendas,
        custoEnvio_vendas: data.custoEnvio ? data.custoEnvio : dataDb.custoEnvio_vendas,
        valorVenda_vendas: data.valorVenda ? data.valorVenda : dataDb.valorVenda_vendas,
        codigoRastreio_vendas: data.codigoRastreio ? data.codigoRastreio : dataDb.codigoRastreio_vendas,
        informacoesAdicional_vendas: data.informacoesAdicional
          ? data.informacoesAdicional
          : dataDb.informacoesAdicional_vendas,
        dataVenda_vendas: dataVenda ? dataVenda : dataDb.dataVenda_vendas,
        length: length,
        width: width,
        height: height,
        distance_unit: distance_unit,
        weight: weight,
        mass_unit: mass_unit,
        gerarEtiqueta: isLabel,
        positionRate: 0
      }

      //positionRate: freteSelected?.positionArray
    } else {
      formData = {
        photo_vendas: img ? img : dataDb.photo_vendas,
        produto_vendas: fieldProduto?.target?.value ? JSON.parse(fieldProduto?.target?.value) : dataDb.produto_vendas,
        categoria_vendas: fieldCategoria?.target?.value ? fieldCategoria.target.value : dataDb.categoria_vendas,
        formaPagamento_vendas: fieldFpag?.target?.value ? fieldFpag?.target?.value : dataDb.formaPagamento_vendas,
        status_vendas: fieldStatus?.target?.value ? fieldStatus?.target?.value : dataDb.status_vendas,
        cliente_vendas: fieldCliente?.target?.value ? JSON.parse(fieldCliente?.target?.value) : dataDb.cliente_vendas,
        custoProduto_vendas: data.custoProduto ? data.custoProduto : dataDb.custoProduto_vendas,
        custoEnvio_vendas: data.custoEnvio ? data.custoEnvio : dataDb.custoEnvio_vendas,
        valorVenda_vendas: data.valorVenda ? data.valorVenda : dataDb.valorVenda_vendas,
        codigoRastreio_vendas: data.codigoRastreio ? data.codigoRastreio : dataDb.codigoRastreio_vendas,
        informacoesAdicional_vendas: data.informacoesAdicional
          ? data.informacoesAdicional
          : dataDb.informacoesAdicional_vendas,
        dataVenda_vendas: dataVenda ? dataVenda : dataDb.dataVenda_vendas,
        gerarEtiqueta: isLabel
      }
    }

    await fetch(`${baseUrlApi}/vendas/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(response => {
      response.json().then(data => {
        setRespVenda(data)
      })
    })

    setLoading(false)
  }

  const calculateFrete = async () => {
    var urlParam = `${baseUrlApi}/frete?gerarEtiqueta=${isLabel}&cliente_vendas=${dataDb.id_clientes}&length=${length}&width=${width}&height=${height}&distance_unit=${distance_unit}&weight=${weight}&mass_unit=${mass_unit}`

    await fetch(urlParam, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(async response => {
      await response.json().then(dataItem => {
        setRates(dataItem)
      })
    })
  }

  const handleSetRate = (rateSelectedParam, freteSelectedParam) => {
    setRateSelected(rateSelectedParam)
    setFreteSelected(freteSelectedParam)
  }

  if (load) {
    return <h1>Carregando....</h1>
  } else {
    return (
      <Grid container spacing={6}>
        {respVenda?.status !== 'OK' && (
          <Grid item sm={12} md={12} lg={8}>
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
                    {dataDb?.photo_vendas && (
                      <Grid item xs={12} md={12} lg={12}>
                        <InputLabel id='demo-simple-select-outlined-label'>FOTO ATUAL:</InputLabel>
                        <FormControl fullWidth>
                          {dataDb?.photo_vendas ? (
                            <img src={dataDb.photo_vendas} alt='img' width={200} height='auto' />
                          ) : (
                            <br />
                          )}
                        </FormControl>
                      </Grid>
                    )}

                    {dataDb?.photo_vendas && (
                      <InputLabel id='demo-simple-select-outlined-label'>
                        -------------------------------------------------------------------
                      </InputLabel>
                    )}

                    <Grid item xs={12} md={12} lg={12}>
                      <InputLabel id='demo-simple-select-outlined-label'>FOTO NOVA:</InputLabel>
                      <FormControl fullWidth>
                        {file ? (
                          <img src={file} alt='img' width={300} height='300' style={{ marginBottom: 30 }} />
                        ) : (
                          <br />
                        )}
                        <input type='file' onChange={handleUploadImage} />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={12} lg={6}>
                      <Calendario date={date} setDate={setDate} />
                      <p style={{ padding: 0, margin: 0 }}>
                        <strong>Data Venda:</strong>{' '}
                        {dataDb?.dataVenda_vendas ? formatData(dataDb?.dataVenda_vendas) : 'NÃO INFORMADO'}
                      </p>
                    </Grid>

                    <Grid item xs={12} md={12} lg={6}>
                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel id='demo-simple-select-outlined-label'>SELECIONE A CATEGORIA</InputLabel>
                        <Select
                          label='SELECIONE A CATEGORIA'
                          defaultValue=''
                          id='demo-simple-select-outlined'
                          labelId='demo-simple-select-outlined-label'
                          sx={{ width: '100%' }}
                          onChange={setFieldCategoria}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          {listCategorias.map((item, index) => (
                            <MenuItem key={index} value={item.nomeCategoria_categorias}>
                              {item.nomeCategoria_categorias}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <p style={{ padding: 0, margin: 0 }}>
                        <strong>Categoria:</strong>{' '}
                        {dataDb?.categoria_vendas != '' ? dataDb?.categoria_vendas : 'NÃO INFORMADO'}
                      </p>
                    </Grid>

                    {/* envio, presencial */}
                    <Grid item xs={12} md={12} lg={6}>
                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel id='demo-simple-select-outlined-label'>FORMA DE PAGAMENTO</InputLabel>
                        <Select
                          label='FORMA DE PAGAMENTO'
                          defaultValue=''
                          id='demo-simple-select-outlined'
                          labelId='demo-simple-select-outlined-label'
                          sx={{ width: '100%' }}
                          onChange={setFieldFpag}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          {fpag.map((item, index) => (
                            <MenuItem key={index} value={item.nomeFormaDePagamento_formasDePagamentos}>
                              {item.nomeFormaDePagamento_formasDePagamentos}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <p style={{ padding: 0, margin: 0 }}>
                        <strong>Forma Pagamento:</strong>{' '}
                        {dataDb?.formaPagamento_vendas != '' ? dataDb?.formaPagamento_vendas : 'NÃO INFORMADO'}
                      </p>
                    </Grid>

                    <Grid item xs={12} md={12} lg={6}>
                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel id='demo-simple-select-outlined-label'>STATUS DA VENDA</InputLabel>
                        <Select
                          label='FORMA DE PAGAMENTO'
                          defaultValue=''
                          id='demo-simple-select-outlined'
                          labelId='demo-simple-select-outlined-label'
                          sx={{ width: '100%' }}
                          onChange={setFieldStatus}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={'PAGO'}>PAGO</MenuItem>
                          <MenuItem value={'PENDENTE'}>PENDENTE</MenuItem>
                        </Select>
                      </FormControl>
                      <p style={{ padding: 0, margin: 0 }}>
                        <strong>Status da Venda:</strong>{' '}
                        {dataDb?.status_vendas != '' ? dataDb?.status_vendas : 'NÃO INFORMADO'}
                      </p>
                    </Grid>

                    <Grid item xs={12} md={12} lg={4}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='custoProduto'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoFocus
                              label='Custo do Produto'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.custoProduto)}
                              placeholder='0.00'
                            />
                          )}
                        />
                      </FormControl>
                      <p style={{ padding: 0, margin: 0 }}>
                        <strong>Custo do Produto:</strong>{' '}
                        {dataDb?.custoProduto_vendas != '' ? dataDb?.custoProduto_vendas : 'NÃO INFORMADO'}
                      </p>
                    </Grid>

                    <Grid item xs={12} md={12} lg={4}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='custoEnvio'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoFocus
                              label='Custo do Envio'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.custoEnvio)}
                              placeholder='0.00'
                            />
                          )}
                        />
                      </FormControl>
                      <p style={{ padding: 0, margin: 0 }}>
                        <strong>Custo do Envio:</strong>{' '}
                        {dataDb?.custoEnvio_vendas != '' ? dataDb?.custoEnvio_vendas : 'NÃO INFORMADO'}
                      </p>
                    </Grid>

                    <Grid item xs={12} md={12} lg={4}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='valorVenda'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoFocus
                              label='Valor de Venda'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.valorVenda)}
                              placeholder='0.00'
                            />
                          )}
                        />
                      </FormControl>
                      <p style={{ padding: 0, margin: 0 }}>
                        <strong>Valor de Venda:</strong>{' '}
                        {dataDb?.valorVenda_vendas != '' ? dataDb?.valorVenda_vendas : 'NÃO INFORMADO'}
                      </p>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} sx={{ mb: 5 }}>
                      <Typography variant='h6' component='h6'>
                        Gerar Etiqueta?
                      </Typography>

                      <br />

                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel id='demo-simple-select-outlined-label'>GERAR?</InputLabel>
                        <Select
                          label='GERAR?'
                          defaultValue={isLabel}
                          id='demo-simple-select-outlined1'
                          labelId='demo-simple-select-outlined-label1'
                          sx={{ width: '100%' }}
                          onChange={value => {
                            setIsLabel(value.target.value)
                          }}
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={'SIM'}>SIM</MenuItem>
                          <MenuItem value={'NAO'}>NÃO</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {isLabel == 'NAO' && (
                      <Grid item xs={12} md={12} lg={12}>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                          <Controller
                            name='codigoRastreio'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <TextField
                                autoFocus
                                label='Código Rastreamento'
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                error={Boolean(errors.codigoRastreio)}
                                placeholder='XX0000000XX'
                              />
                            )}
                          />
                        </FormControl>
                        <p style={{ padding: 0, margin: 0 }}>
                          <strong>Código de Rastreamento:</strong>{' '}
                          {dataDb?.codigoRastreio_vendas != '' ? dataDb?.codigoRastreio_vendas : 'NÃO INFORMADO'}
                        </p>
                      </Grid>
                    )}

                    <Grid item xs={12} md={12} lg={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='informacoesAdicional'
                          control={control}
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
                        {dataDb?.informacoesAdicional_vendas != ''
                          ? dataDb?.informacoesAdicional_vendas
                          : 'NÃO INFORMADO'}
                      </p>
                    </Grid>

                    {dataDb?.length == '0' &&
                      dataDb?.width == '0' &&
                      dataDb?.height == '0' &&
                      dataDb?.distance_unit == '0' &&
                      dataDb?.weight == '0' &&
                      dataDb?.mass_unit == '0' &&
                      isLabel == 'SIM' && (
                        <>
                          <Grid item xs={12} md={12} lg={4}>
                            <TextField
                              autoFocus
                              label='Length'
                              value={length}
                              onChange={value => setLength(value.target.value)}
                              placeholder='0'
                            />
                          </Grid>

                          <Grid item xs={12} md={12} lg={4}>
                            <TextField
                              label='Width'
                              value={width}
                              onChange={value => setWidth(value.target.value)}
                              placeholder='0'
                            />
                          </Grid>

                          <Grid item xs={12} md={12} lg={4}>
                            <TextField
                              label='Height'
                              value={height}
                              onChange={value => setHeight(value.target.value)}
                              placeholder='0'
                            />
                          </Grid>

                          <Grid item xs={12} md={12} lg={4}>
                            <TextField
                              label='Distance Unit'
                              value={distance_unit}
                              onChange={value => setDistanceUnit(value.target.value)}
                              placeholder='0'
                            />
                          </Grid>

                          <Grid item xs={12} md={12} lg={4}>
                            <TextField
                              label='Weight'
                              value={weight}
                              onChange={value => setWeight(value.target.value)}
                              placeholder='0'
                            />
                          </Grid>

                          <Grid item xs={12} md={12} lg={4}>
                            <TextField
                              label='mass_unit'
                              value={mass_unit}
                              onChange={value => setMassUnit(value.target.value)}
                              placeholder='lb'
                            />
                          </Grid>

                          {weight !== '' && (
                            <Grid item xs={12} md={12} lg={12}>
                              <Button
                                onClick={calculateFrete}
                                type='button'
                                variant='contained'
                                size='large'
                                color='warning'
                              >
                                Obter Valores do Frete
                              </Button>
                            </Grid>
                          )}
                        </>
                      )}

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
                        <Button disabled={loading} type='submit' variant='contained' size='large'>
                          SALVAR
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        )}

        {respVenda.status == 'OK' && (
          <Grid item sm={12} md={12} lg={12}>
            <Card>
              <CardHeader
                title={
                  respVenda.transaction.gerarEtiqueta == 'SIM'
                    ? 'Etiqueta e Informações'
                    : 'Informações da venda Publicada'
                }
              />
              <CardContent>
                {respVenda.transaction.gerarEtiqueta == 'SIM' && (
                  <Alert severity='success'>Venda editada com Sucesso e Etiqueta Gerada!</Alert>
                )}
                {respVenda.transaction.gerarEtiqueta == 'NAO' && (
                  <Alert severity='success'>Venda editada com Sucesso!</Alert>
                )}

                {respVenda.transaction.gerarEtiqueta == 'SIM' && (
                  <ListItem>
                    <ListItemText
                      primary='URL ETIQUETA'
                      secondary={
                        <a
                          href={respVenda.transaction.labelUrl}
                          target='_blank'
                          style={{ color: '#4cc9f0', fontSize: 15 }}
                        >
                          {respVenda.transaction.labelUrl}
                        </a>
                      }
                    />
                  </ListItem>
                )}

                {respVenda.transaction.gerarEtiqueta == 'SIM' && (
                  <ListItem>
                    <ListItemText
                      primary='URL TRACKING'
                      secondary={
                        <a
                          href={respVenda.transaction.urlTracking}
                          target='_blank'
                          style={{ color: '#4cc9f0', fontSize: 15 }}
                        >
                          {respVenda.transaction.urlTracking}
                        </a>
                      }
                    />
                  </ListItem>
                )}

                {respVenda.transaction.gerarEtiqueta == 'SIM' && (
                  <ListItem>
                    <ListItemText primary='NUMBER TRACKING' secondary={respVenda.transaction.numberTracking} />
                  </ListItem>
                )}

                <br />
                <br />
                <Button
                  type='button'
                  variant='contained'
                  size='large'
                  onClick={() => {
                    router.push({
                      pathname: '/dashboard/vendas/lista'
                    })
                  }}
                >
                  IR PARA TODAS AS VENDAS
                </Button>

                <Button
                  color='success'
                  type='button'
                  variant='contained'
                  size='large'
                  onClick={() => {
                    location.href = '/dashboard/vendas/'
                  }}
                >
                  NOVA VENDA
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {respVenda?.transaction?.gerarEtiqueta == undefined && (
          <Grid item sm={12} md={12} lg={4}>
            <Grid item sm={12} md={12} lg={12} sx={{ marginBottom: 10 }}>
              <Card>
                <CardHeader title='Produtos: ' />
                <CardContent sx={{ height: 300, overflowY: 'scroll' }}>
                  <TextField
                    sx={{ width: '100%', marginBottom: 5 }}
                    label='Digite um nome...'
                    value={searchProduct}
                    onChange={v => {
                      setSearchProduct(v.target.value)
                    }}
                    placeholder='Digite um Nome...'
                  />

                  {produto.length > 0 && (
                    <>
                      {produto.map((item, index) => {
                        return (
                          <FormGroup row>
                            <FormControlLabel
                              label={item.nomeProduto_produtos}
                              control={
                                <Checkbox value={item.id_produtos} onChange={setFieldProduto} name='basic-checked' />
                              }
                            />
                          </FormGroup>
                        )
                      })}
                    </>
                  )}
                  {produto.length <= 0 && (
                    <Alert sx={{ width: '100%' }} severity='warning'>
                      Nenhuma informação Encontrada
                    </Alert>
                  )}
                </CardContent>
              </Card>
              <p
                style={{
                  padding: 7,
                  margin: 0,
                  backgroundColor: '#444',
                  color: theme.palette.mode == 'dark' ? '#fff' : '#fff'
                }}
              >
                <strong>Produto:</strong>{' '}
                {dataDb?.nomeProduto_produtos != '' ? dataDb?.nomeProduto_produtos : 'NÃO INFORMADO'}
              </p>
            </Grid>

            <Grid item sm={12} md={12} lg={12} sx={{ marginBottom: 10 }}>
              <Card>
                <CardHeader title='Clientes: ' />
                <CardContent sx={{ height: 300, overflowY: 'scroll' }}>
                  <TextField
                    sx={{ width: '100%', marginBottom: 5 }}
                    label='Digite um nome...'
                    value={searchClient}
                    onChange={v => {
                      setSeatchClient(v.target.value)
                    }}
                    placeholder='Digite um Nome...'
                  />

                  {cliente.length > 0 && (
                    <>
                      {cliente.map((item, index) => {
                        return (
                          <FormGroup row>
                            <FormControlLabel
                              label={item.nomeCliente_clientes}
                              control={
                                <Checkbox value={item.id_clientes} onChange={setFieldCliente} name='basic-checked' />
                              }
                            />
                          </FormGroup>
                        )
                      })}
                    </>
                  )}

                  {cliente.length <= 0 && (
                    <Alert sx={{ width: '100%' }} severity='warning'>
                      Nenhuma informação Encontrada
                    </Alert>
                  )}
                </CardContent>
              </Card>
              <p
                style={{
                  padding: 7,
                  margin: 0,
                  backgroundColor: '#444',
                  color: theme.palette.mode == 'dark' ? '#fff' : '#fff'
                }}
              >
                <strong>Cliente:</strong>{' '}
                {dataDb?.nomeCliente_clientes != '' ? dataDb?.nomeCliente_clientes : 'NÃO INFORMADO'}
              </p>
            </Grid>

            {weight.trim() !== '' &&
              rates?.rates?.priorityMail !== undefined &&
              rates?.rates?.priorityMailExpress !== undefined &&
              rates?.rates?.groundAdvantage !== undefined && (
                <Grid item sm={12} md={12} lg={12}>
                  <Card>
                    <CardHeader title='Forma de envio: ' />
                    <CardContent sx={{ height: 'auto' }}>
                      {/* priority mail */}
                      <div
                        style={{
                          backgroundColor: rateSelected === 'Priority Mail' ? '#d9d9d9' : '#fff',
                          padding: 20,
                          borderRadius: 5,
                          marginBottom: 15
                        }}
                      >
                        <ol
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            color: '#000'
                          }}
                        >
                          <li>
                            <strong>Valor de envio:</strong> $ {rates.rates.priorityMail.amount}
                          </li>
                          <li>
                            <strong>Dias estimados:</strong> {rates.rates.priorityMail.estimated_days} dia(s)
                          </li>
                          <li>
                            <strong>Serviço:</strong> {rates.rates.priorityMail.servicelevel}
                          </li>
                        </ol>

                        <button
                          type='button'
                          style={{
                            backgroundColor: '#ef233c',
                            width: '100%',
                            height: 50,
                            borderRadius: 5,
                            fontSize: '1em',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            color: '#fff',
                            border: 'none',
                            marginBottom: 10
                          }}
                          onClick={() => {
                            handleSetRate(rates.rates.priorityMail.servicelevel, rates.rates.priorityMail)
                          }}
                        >
                          Selecionar {rates.rates.priorityMail.servicelevel}
                        </button>
                      </div>

                      {/* priority mail express */}
                      <div
                        style={{
                          backgroundColor: rateSelected === 'Priority Mail Express' ? '#d9d9d9' : '#fff',
                          padding: 20,
                          borderRadius: 5,
                          marginBottom: 15
                        }}
                      >
                        <ol
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            color: '#000'
                          }}
                        >
                          <li>
                            <strong>Valor de envio:</strong> $ {rates.rates.priorityMailExpress.amount}
                          </li>
                          <li>
                            <strong>Dias estimados:</strong> {rates.rates.priorityMailExpress.estimated_days} dia(s)
                          </li>
                          <li>
                            <strong>Serviço:</strong> {rates.rates.priorityMailExpress.servicelevel}
                          </li>
                        </ol>

                        <button
                          type='button'
                          style={{
                            backgroundColor: '#7209b7',
                            width: '100%',
                            height: 50,
                            borderRadius: 5,
                            fontSize: '1em',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            color: '#fff',
                            border: 'none',
                            marginBottom: 10
                          }}
                          onClick={() => {
                            handleSetRate(rates.rates.priorityMailExpress.servicelevel, rates.rates.priorityMailExpress)
                          }}
                        >
                          Selecionar {rates.rates.priorityMailExpress.servicelevel}
                        </button>
                      </div>

                      {/* Ground Advantage */}
                      <div
                        style={{
                          backgroundColor: rateSelected === 'Ground Advantage' ? '#d9d9d9' : '#fff',
                          padding: 20,
                          borderRadius: 5,
                          marginBottom: 15
                        }}
                      >
                        <ol
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            color: '#000'
                          }}
                        >
                          <li>
                            <strong>Valor de envio:</strong> $ {rates.rates.groundAdvantage.amount}
                          </li>
                          <li>
                            <strong>Dias estimados:</strong> {rates.rates.groundAdvantage.estimated_days} dia(s)
                          </li>
                          <li>
                            <strong>Serviço:</strong> {rates.rates.groundAdvantage.servicelevel}
                          </li>
                        </ol>

                        <button
                          type='button'
                          style={{
                            backgroundColor: '#000000',
                            width: '100%',
                            height: 50,
                            borderRadius: 5,
                            fontSize: '1em',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            color: '#fff',
                            border: 'none',
                            marginBottom: 10
                          }}
                          onClick={() => {
                            handleSetRate(rates.rates.groundAdvantage.servicelevel, rates.rates.groundAdvantage)
                          }}
                        >
                          Selecionar {rates.rates.groundAdvantage.servicelevel}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              )}
          </Grid>
        )}
      </Grid>
    )
  }
}

export default FormVendas
