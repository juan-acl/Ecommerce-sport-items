import { useReducer, useCallback, useEffect } from 'react';
import { useLazyListOrdersQuery } from '../api/ordersApi';
import type { Order } from '../types';

interface State {
  orders: Order[];
  hasMore: boolean;
}

type Action =
  | { type: 'PAGE_LOADED'; orders: Order[]; nextCursor?: string; isFirstPage: boolean }
  | { type: 'RESET' };

const initialState: State = {
  orders: [],
  hasMore: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'RESET':
      return initialState;
    case 'PAGE_LOADED':
      return {
        ...state,
        orders: action.isFirstPage ? action.orders : [...state.orders, ...action.orders],
        hasMore: !!action.nextCursor,
      };
    default:
      return state;
  }
}

const PAGE_SIZE = 5;

export function useOrders() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [trigger, { data, isLoading, isFetching, originalArgs }] = useLazyListOrdersQuery();

  // Cargar primera página al montar
  useEffect(() => {
    trigger({ limit: PAGE_SIZE });
  }, [trigger]);

  // Cuando llega data, dispatch al reducer
  useEffect(() => {
    if (!data) return;
    const isFirstPage = !originalArgs?.cursor;
    dispatch({
      type: 'PAGE_LOADED',
      orders: data.orders,
      nextCursor: data.pagination.nextCursor,
      isFirstPage,
    });
  }, [data, originalArgs]);

  const loadMore = useCallback(() => {
    if (!data?.pagination.nextCursor || isFetching) return;
    trigger({ limit: PAGE_SIZE, cursor: data.pagination.nextCursor });
  }, [data, isFetching, trigger]);

  return {
    orders: state.orders,
    isLoading,
    isFetching,
    hasMore: state.hasMore,
    loadMore,
  };
}
