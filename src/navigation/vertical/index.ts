// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      icon: 'bx:home-circle',
      title: 'Dashboard',
      path: '/dashboard/main/'
    },
    {
      icon: 'bx-align-middle',
      title: 'Minhas Tarefas',
      path: '/dashboard/kanban/'
    },
    {
      icon: 'bx-bar-chart',
      title: 'Atividades',
      path: '/dashboard/atividades/'
    },
    {
      icon: 'bx:user',
      title: 'Clientes',
      path: '/dashboard/clientes/lista'
    },
    {
      icon: 'bx-archive',
      title: 'Projetos',
      path: '/dashboard/projetos/lista/'
    },
    {
      icon: 'bx-bar-chart-alt-2',
      title: 'Financeiro',
      path: '/dashboard/main/'
    }
  ]
}

export default navigation
