import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {
  userID,
  fetchMenu,
  createOrder,
  fetchUserOrders,
  selectMeal,
  resetMenu,
  setMenus,
  handleOrderSuccess,
  handleOrderFailure,
  fetchMenuFailure,
  setOrdersFailure
} from '../../actions/menuAction';
import {
  SET_MENUS,
  SELECT_MEAL,
  RESET_MENU,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_LOADING,
  FETCH_USERS_MENU_SUCCESS,
  FETCH_USERS_MENU_LOADING,
  CREATE_ORDER_LOADING,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  MAKE_ORDER_SUCCESS,
  MAKE_ORDER_FAILURE,
  FETCH_USERS_MENU_FAILURE,
  FETCH_ORDERS_FAILURE
} from '../../actions/actionTypes';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

/*
global jest
expect
*/
describe('Menu actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('should set upcoming menus', async (done) => {
    moxios.stubRequest(`/menus/lunch/2018-11-11/2018-11-18`, {
      status: 200,
      response: {
        payload: {
          menuList: []
        }
      }
    });
    const expectedActions = [
      {
        type: FETCH_USERS_MENU_LOADING,
        payload: true
      },
      {
        type: FETCH_USERS_MENU_SUCCESS,
        payload: []
      },
      {
        type: FETCH_USERS_MENU_LOADING,
        payload: false
      }
    ];
    const store = mockStore({});
    await store.dispatch(fetchMenu('2018-11-11', '2018-11-18'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('should fail to set upcoming menus', async (done) => {
    moxios.stubRequest(`/menus/lunch/2018-11-11/2018-11-18`, {
      status: 400,
      response: {
        payload: 'failed to fetch'
      }
    });
    const store = mockStore({});
    await store.dispatch(fetchMenu('2018-11-11', '2018-11-18'))
      .then(() => {
        expect(store.getActions()[1].type).toEqual(FETCH_USERS_MENU_FAILURE);
      });
    done();
  });

  it('should fetch users orders', async (done) => {
    const startDate = '2018-11-18';
    const endDate = '2018-12-12';

    moxios.stubRequest(`/orders/user/${userID}/${startDate}/${endDate}`, {
      status: 200,
      response: {
        payload: {
          orders: []
        }
      }
    });
    const expectedActions = [
      {
        type: FETCH_ORDERS_LOADING,
        isLoading: true
      },
      {
        type: FETCH_ORDERS_SUCCESS,
        payload: []
      },
      {
        type: FETCH_ORDERS_LOADING,
        isLoading: false
      }
    ];
    const store = mockStore({});
    await store.dispatch(fetchUserOrders(startDate, endDate))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('should fail to fetch users orders in case of an error', async (done) => {
    const startDate = '2018-11-18';
    const endDate = '2018-12-12';

     moxios.stubRequest(`/orders/user/${userID}/${startDate}/${endDate}`, {
      status: 400,
      response: {
        payload: {
          error: "An error has occurred",
        }
      }
    });
    const store = mockStore({});
    await store.dispatch(fetchUserOrders(startDate, endDate))
      .then(() => {
        expect(store.getActions()[1].type).toEqual(FETCH_ORDERS_FAILURE);
      });
    done();
  });

  it('should handle order success', async (done) => {
    moxios.stubRequest(`/orders/`, {
      status: 200,
      response: {}
    });
    const expectedActions = [
      {
        type: CREATE_ORDER_LOADING,
        payload: true
      },
      {
        type: CREATE_ORDER_SUCCESS,
        payload: {}
      },
      {
        type: CREATE_ORDER_LOADING,
        payload: false
      }
    ];
    const order = {
      mainMeal: 1,
      acc1: 2,
      acc2: 3
    };
    const store = mockStore({});
    await store.dispatch(createOrder(order))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('should handle order failure', async (done) => {
    moxios.stubRequest(`/orders/`, {
      status: 400,
    });
    const expectedActions = [{"payload": true, "type": "CREATE_ORDER_LOADING"}, {"payload": new Error("Request failed with status code 400"), "type": "CREATE_ORDER_FAILURE"}, {"payload": false, "type": "CREATE_ORDER_LOADING"}];
    const order = {
      mainMeal: 1,
      acc1: 2,
      acc2: 3
    };
    const store = mockStore({});
    await store.dispatch(createOrder(order))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('should select meal', async (done) => {
    const payload = { prop: '', value: '' };
    const expectedActions = [{
      type: SELECT_MEAL,
      payload
    }];
    const store = mockStore({});
    store.dispatch(selectMeal(payload));
    expect(store.getActions()).toEqual(expectedActions);
    done();
  });

  it('should reset menu', async (done) => {
    const expectedActions = [{
      type: RESET_MENU
    }];
    const store = mockStore({});
    store.dispatch(resetMenu());
    expect(store.getActions()).toEqual(expectedActions);
    done();
  });

  it('should set menus', () => {
    const menu = { menu: 'this is a menu' };
    const expectedAction = { type: SET_MENUS, payload: menu };
    expect(setMenus(menu)).toEqual({ ...expectedAction });
  });

   it('should handle orders successfully', () => {
    const order = { order: 'this is an order' };
    const expectedAction = { type: MAKE_ORDER_SUCCESS, payload: order };
    expect(handleOrderSuccess(order)).toEqual({ ...expectedAction });
  });

   it('should fail to handle an order in case of an error', () => {
    const order = { order: 'failed to fetch' };
    const expectedAction = { type: MAKE_ORDER_FAILURE, payload: order };
    expect(handleOrderFailure(order)).toEqual({ ...expectedAction });
  });

   it('should fail to fetch a menu in case of an error', () => {
    const menu = { menu: 'failed to fetch' };
    const expectedAction = { type: FETCH_USERS_MENU_FAILURE, payload: menu };
    expect(fetchMenuFailure(menu)).toEqual({ ...expectedAction });
  });

   it('should fail to set an order in case of an error', () => {
    const error = { error: 'failed to fetch' };
    const expectedAction = { type: FETCH_ORDERS_FAILURE, error };
    expect(setOrdersFailure(error)).toEqual({ ...expectedAction });
  });
});
