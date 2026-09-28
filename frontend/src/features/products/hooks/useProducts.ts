import { useReducer, useCallback, useEffect } from 'react';
import { useLazyListProductsQuery } from '../api/productsApi';
import type { Product } from '@shared/types/common';

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  isFetching: boolean;
  hasMore: boolean;
  loadMore: () => void;
  setCategory: (category?: string) => void;
  selectedCategory?: string;
}

interface State {
  products: Product[];
  cursor?: string;
  hasMore: boolean;
  selectedCategory?: string;
}

type Action =
  | { type: 'CATEGORY_CHANGED'; category?: string }
  | { type: 'PAGE_LOADED'; products: Product[]; nextCursor?: string; isFirstPage: boolean }
  | { type: 'LOAD_MORE'; cursor: string };

const initialState: State = {
  products: [],
  cursor: undefined,
  hasMore: true,
  selectedCategory: undefined,
};

function removeDuplicates(products: Product[]): Product[] {
  const seen = new Set(products);
  return [...seen];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CATEGORY_CHANGED':
      return {
        ...state,
        selectedCategory: action.category,
      };
    case 'LOAD_MORE':
      return {
        ...state,
        cursor: action.cursor,
      };
    case 'PAGE_LOADED':
      return {
        ...state,
        products: action.isFirstPage
          ? action.products
          : removeDuplicates([...state.products, ...action.products]),
        hasMore: !!action.nextCursor,
      };
    default:
      return state;
  }
}

const PAGE_SIZE = 3;

export function useProducts(): UseProductsReturn {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [trigger, { data, isLoading, isFetching, originalArgs, error }] =
    useLazyListProductsQuery();

  useEffect(() => {
    trigger({ limit: PAGE_SIZE, category: state.selectedCategory });
  }, [state.selectedCategory, trigger]);

  useEffect(() => {
    if (!data) return;

    const isFirstPage = !originalArgs?.cursor;

    dispatch({
      type: 'PAGE_LOADED',
      products: data.products,
      nextCursor: data.pagination.nextCursor,
      isFirstPage,
    });
  }, [data, originalArgs]);

  const loadMore = useCallback(() => {
    if (error) return;
    if (!data?.pagination.nextCursor || isFetching) return;
    const nextCursor = data.pagination.nextCursor;
    dispatch({ type: 'LOAD_MORE', cursor: nextCursor });
    trigger({
      limit: PAGE_SIZE,
      cursor: nextCursor,
      category: state.selectedCategory,
    });
  }, [data, isFetching, state.selectedCategory, trigger, error]);

  const setCategory = useCallback((category?: string) => {
    dispatch({ type: 'CATEGORY_CHANGED', category });
  }, []);

  return {
    products: state.products,
    isLoading,
    isFetching,
    hasMore: state.hasMore,
    loadMore,
    setCategory,
    selectedCategory: state.selectedCategory,
  };
}
