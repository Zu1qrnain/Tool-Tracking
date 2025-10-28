import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 py-2">
      <div className="text-center w-100">
        <span>© 2025 Tool Tracker</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
