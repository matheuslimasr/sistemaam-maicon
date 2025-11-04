// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      icon: 'bx:home-circle',
      title: 'Dashboard',
      path: '/dashboard/main/'
    },
    {
      icon: 'bx:align-justify',
      title: 'Listas',
      children: [
        {
          icon: 'bx:circle',
          title: 'Produtos',
          path: '/dashboard/produtos/lista'
        },
        {
          icon: 'bx:circle',
          title: 'Vendas',
          path: '/dashboard/vendas/lista'
        },
        {
          icon: 'bx:circle',
          title: 'Clientes',
          path: '/dashboard/clientes/lista'
        },
        {
          icon: 'bx:circle',
          title: 'Categorias',
          path: '/dashboard/categorias/lista'
        },
        {
          icon: 'bx:circle',
          title: 'Formas de Pagamento',
          path: '/dashboard/formadepagamentos/lista'
        },
        {
          icon: 'bx:circle',
          title: 'Sorteios',
          path: '/dashboard/sorteios/lista'
        }
      ]
    },
    {
      icon: 'bx:plus',
      title: 'Banner',
      path: '/dashboard/banner/',
      children: [
        {
          icon: 'bx:plus',
          title: 'Atualizar Banner',
          path: '/dashboard/banner'
        },
        {
          icon: 'bx:plus',
          title: 'Todos os Banner',
          path: '/dashboard/banner/lista'
        }
      ]
    },
    {
      icon: 'bx:plus',
      title: 'Cadastros',
      children: [
        {
          icon: 'bx:plus',
          title: 'Cadastrar Venda',
          path: '/dashboard/vendas'
        },
        {
          icon: 'bx:plus',
          title: 'Produtos',
          path: '/dashboard/produtos'
        },
        {
          icon: 'bx:plus',
          title: 'Clientes',
          path: '/dashboard/clientes'
        },
        {
          icon: 'bx:plus',
          title: 'Categorias',
          path: '/dashboard/categorias'
        },
        {
          icon: 'bx:plus',
          title: 'Forma de Pagamento',
          path: '/dashboard/formadepagamentos'
        }
      ]
    },
    {
      icon: 'bx:plus',
      title: 'Reports',
      children: [
        {
          icon: 'bx:circle',
          title: 'Vendas',
          path: '/dashboard/reports'
        },
        {
          icon: 'bx:circle',
          title: 'Clientes',
          path: '/dashboard/reportclients'
        }
      ]
    },
    {
      icon: 'bx:plus',
      title: 'Leilão',
      children: [
        {
          icon: 'bx:circle',
          title: 'Cadastrar um produto',
          path: '/dashboard/leilao'
        },
        {
          icon: 'bx:align-justify',
          title: 'Todos',
          path: '/dashboard/leilao/lista'
        }
      ]
    }
  ]
}

export default navigation
