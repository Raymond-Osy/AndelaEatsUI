import React, { Component } from 'react';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import { Redirect, Route, NavLink } from 'react-router-dom';
import PropType from 'prop-types';

import Menus from './Menus';
import { 
  getUpComingMenus, 
  selectMeal, 
  orderMeal, 
  resetMenu 
} from '../../actions/menuAction';
import canOrderMeal from '../../helpers/canOrderMeal';
import ConfirmOrder from './ConfirmOrder';
import Loader from '../common/Loader/Loader';

/* eslint-disable */

const validateDate = (menu, endDate) => new Date(menu.date).getDate() <= endDate
  && new Date(menu.date).getDate() >= new Date().getDate();

/**
 *
 *
 * @class Orders
 * @extends {Component}
 */
export class Orders extends Component {
  /**
   *Creates an instance of Orders.
   * @param {*} props
   * @memberof Orders
   */
  constructor(props) {
    super(props);
    this.state = {
      endDate: new Date().getDate() + 7,
      isModalOpen: false,
      isLoading: true
    };
  }

  componentDidMount() {
    this.props.getUpComingMenus()
      .then(() => {
        this.setState({isLoading: false})
        this.selectDefaultMenu();
      });
  }

  toggleModal = () => {
    const { acc1, acc2, mainMeal } = this.props.mealSelected;
    if (acc1 !== '' && acc2 !== '' && mainMeal !== '') {
      this.setState(state => ({
        isModalOpen: !state.isModalOpen,
      }));
    }
  }

  selectDefaultMenu() {
    const selectedMeal = this.props.menus.find(menu => canOrderMeal(menu)
      && validateDate(menu, this.state.endDate)
    );

    this.context.router.history
      .push(`${this.props.match.url}/${selectedMeal.id}`);
  }

  /**
   *
   *
   * @returns {void}
   * @memberof Orders
   */
  renderDates() {
    if (this.props.menus) {
      return this.props.menus.map((menuDate) => {
        if (validateDate(menuDate, this.state.endDate)) {
          return (
            <li
              key={menuDate.id}
              className={canOrderMeal(menuDate) ? "dates" : 'dates-disable'}
            >
              <NavLink
                activeClassName={canOrderMeal(menuDate)
                  ? "active" : 'isDisabled'}

                to={canOrderMeal(menuDate)
                  ? `${this.props.match.url}/${menuDate.id}` : '#'}
              >
                {format(menuDate.date, 'dddd Do')}
              </NavLink>
              <div className="border-circle" />
            </li>
          );
        }
        return false;
      });
    }
  }


  render() {
    const { match: { url }, menus, selectMeal, mealSelected, orderMeal, message, resetMenu } = this.props;
    return (
      <div className="wrapper">
      { this.state.isLoading? <Loader/> 
      :<div className="orders-wrapper">
          <h3>Make Orders</h3>

          <div className="orders-container">
            <div className="date-wrapper">
              <h3>
                {format(Date.now(), "MMMM YYYY")}
              </h3>
              <ul>
                {this.renderDates()}
              </ul>
            </div>
            <div className="menu-wrapper">
              <Route
                path={`${url}/:id`}
                render={(props) => (
                  <div>
                    <Menus 
                      data={menus} 
                      toggleModal={this.toggleModal}
                      selectMeal={selectMeal}
                      resetMenu={resetMenu}
                      {...props} 
                    />
                    <ConfirmOrder 
                      toggleModal={this.toggleModal}
                      isModalOpen={this.state.isModalOpen}
                      menus={menus}
                      mealSelected={mealSelected}
                      orderMeal={orderMeal}
                      message={message}
                      {...props} 
                    />
                  </div>
                )
              }
              />
            </div>
          </div>
        </div>
      }
      </div>
    );
  }
}

Orders.propTypes = {
  match: PropType.object,
  menus: PropType.array,
  getUpComingMenus: PropType.func
};

Orders.contextTypes = {
  router: PropType.object.isRequired
};

/**
 * connect to redux store
 * @param {state} state
 * @returns {object} menus
 */
function mapStateToProps(state) {
  const {
    menus, acc1, acc2, mainMeal, message 
  } = state.upcomingMenus;

  const mealSelected = {
    mainMeal,
    firstAccompaniment: acc1,
    secondAccompaniment: acc2,
  };
  return { menus, mealSelected, message };
}

export default connect(mapStateToProps,
  {
    getUpComingMenus,
    selectMeal,
    orderMeal,
    resetMenu
  })(Orders);