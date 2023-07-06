import React from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'

import './Pagination.css'

class PaginationComponent extends React.Component {
  onChange = (page) => {
    const { onPageChange } = this.props
    onPageChange(page)
  }

  render() {
    const { currentPage, totalItems } = this.props
    return (
      <div className="pagination">
        <Pagination
          current={currentPage}
          onChange={this.onChange}
          total={totalItems}
          pageSize="20"
          pageSizeOptions={[20]}
        />
      </div>
    )
  }
}

PaginationComponent.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default PaginationComponent
