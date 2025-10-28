import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilList,
  cilCalendar,
  cilCheckCircle,
  cilClipboard,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // ===== Main Section =====
  {
    component: CNavTitle,
    name: 'Main',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  // ===== Tool Section =====
  {
    component: CNavTitle,
    name: 'Tool Management',
  },
  {
    component: CNavItem,
    name: 'All Tools',
    to: '/tools',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Issued Tools',
    to: '/issuances',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },

  // ===== Optional Read-Only Section for Users =====
  {
    component: CNavItem,
    name: 'Calibration Schedule',
    to: '/calibration',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Maintenance',
    to: '/maintenance',
    icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
  },
]

export default _nav
