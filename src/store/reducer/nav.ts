import { PAGE_CHANGE } from "../constants";
import store from "..";

export default function (state: string, action: { type: string, page: string }) {
  const { type, page } = action

  switch (type) {
    case PAGE_CHANGE:
      {

        if (page === 'textbook') {
          store.sprintMode = 'textbook'
        }
        if (page === 'start') {
          store.sprintMode = 'free'
        }
        return page
      }
    default:
      return state;
  }
}