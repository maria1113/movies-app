import React from 'react'
import { Tabs } from 'antd'
import './Header.css'
import PropTypes from 'prop-types'

const items = [
  {
    key: '1',
    label: 'Search',
  },
  {
    key: '2',
    label: 'Rated',
  },
]

function Header({ onChange, tab }) {
  return (
    <div className="header">
      <Tabs defaultActiveKey="1" activeKey={tab} items={items} onChange={onChange} />
    </div>
  )
}

Header.propTypes = {
  tab: PropTypes.oneOf(['1', '2']).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Header
