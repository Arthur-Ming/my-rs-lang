import { PAGE_NEXT, PAGE_PREV, PAGE_DOUBLENEXT, MAX_PAGE_TEXTBOOK, PAGE_DOUBLEPREV, MIN_PAGE_TEXTBOOK, GROUP_SELECT } from "../constants"

type StateType = {
  page: number,
  group: number
}

export default function (state: StateType, action: { type: string, group?: number }) {
  const { type, group = 1 } = action

  switch (type) {
    case PAGE_NEXT:
      return {
        ...state,
        page: state.page + 1
      }
    case PAGE_PREV:
      return {
        ...state,
        page: state.page - 1
      }
    case PAGE_DOUBLENEXT:
      return {
        ...state,
        page: MAX_PAGE_TEXTBOOK
      }
    case PAGE_DOUBLEPREV:
      return {
        ...state,
        page: MIN_PAGE_TEXTBOOK
      }
    case GROUP_SELECT:
      return {
        ...state,
        group
      }
    default:
      return state;
  }
}