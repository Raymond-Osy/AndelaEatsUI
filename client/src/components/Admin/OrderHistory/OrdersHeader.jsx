import React from 'react';
import PropTypes from 'prop-types';

const OrdersHeader = (props) => {
  const {
    title,
    ordersCount,
    redirectToExport,
    svg
  } = props;

  const type = props.type || 1;

  return (
    <header className="orders-header">
      <div className="left-section">
        <h2 className="orders-header-title">{title}</h2>
        { type === 1 && (
          <button
            disabled={ordersCount === 0}
            className={`export-btn ${ordersCount === 0 && "grayed"}`}
            onClick={redirectToExport}
            type="button"
          >
            Export
            <span className="export-icon">
              <img src={svg} alt="" />
            </span>
          </button>
        )}
      </div>
      <div>
        { type === 1 && (
          <button
            disabled={ordersCount === 0}
            className={`filter-btn ${ordersCount === 0 && "grayed"}`}
            type="button"
          >
            <i className="fa fa-filter" />
            Filter
          </button>
        )}
        
        { type === 2 && (
          <button
            disabled={ordersCount === 0}
            className={`export-btn-2 ${ordersCount === 0 && "grayed"}`}
            type="button"
          >
            <span className="export-icon">
              <img src={svg} alt="" />
            </span>
            Export
          </button>
        )}
      </div>
    </header>
  );
};

OrdersHeader.propTypes = {
  type: PropTypes.number,
  ordersCount: PropTypes.number.isRequired,
  redirectToExport: PropTypes.func,
  svg: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired
};

export default OrdersHeader;