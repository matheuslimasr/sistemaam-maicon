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

interface FormData {
  nomeProduto: string
  referenciaProduto: string
  informacoesAdicional: string
}

const schema = yup.object().shape({
  nomeProduto: yup.string().trim().required(),
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
    const formData = {
      nomeProduto_produtos: data.nomeProduto,
      informacoesAdicional_produtos: data.referenciaProduto,
      referenciaProduto_produtos: data.informacoesAdicional
    }

    fetch(`${baseUrlApi}/produtos`, {
      method: 'POST',
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

  return (
    <Card>
      <CardHeader title='Cadastro de Produtos' />
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

            {/* <Grid item xs={6}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='descricaoProduto'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Descrição do Produto'
                      rows={4}
                      multiline
                      id='textarea-filled'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.descricaoProduto)}
                      placeholder='Descrição do Produto'
                    />
                  )}
                />
              </FormControl>
            </Grid> */}

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
