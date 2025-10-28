import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="modern-sidebar"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => dispatch({ type: 'set', sidebarShow: visible })}
    >
      {/* Header without Logo */}
      <CSidebarHeader className="border-bottom text-center py-3">
        <CSidebarBrand to="/" className="d-flex align-items-center justify-content-center">
          <div className="header-title">
            <h5 className="m-0 fw-bold text-primary">Tool Tracker</h5>
          </div>
        </CSidebarBrand>
      </CSidebarHeader>

      {/* Sidebar Navigation */}
      <AppSidebarNav items={navigation} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
