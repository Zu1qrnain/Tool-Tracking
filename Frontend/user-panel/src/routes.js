import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Tool Management
const Tools = React.lazy(() => import('./views/tools/Tools'))
const Issuances = React.lazy(() => import('./views/issuances/Issuances'))
const Calibration = React.lazy(() => import('./views/calibration/Calibration'))
const Maintenance = React.lazy(() => import('./views/maintenance/Maintenance'))


// User & Settings
const Users = React.lazy(() => import('./views/users/User'))
const Settings = React.lazy(() => import('./views/settings/Setting'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/tools', name: 'All Tools', element: Tools },
  { path: '/issuances', name: 'Issued Tools', element: Issuances },
  { path: '/calibration', name: 'Calibration Schedule', element: Calibration },
  { path: '/maintenance', name: 'Maintenance', element: Maintenance },
  { path: '/users', name: 'Users', element: Users },
  { path: '/settings', name: 'Settings', element: Settings },
]

export default routes
