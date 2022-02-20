import { HARD_WORD_SELECTED } from "../constants";

type StateType = {
  [wordId: string]: boolean
}

export default function (state: StateType, action: { type: string, wordId: string, isSelected: boolean }) {
  const { type, wordId, isSelected } = action

  switch (type) {
    case HARD_WORD_SELECTED:
      return {
        ...state,
        [wordId]: isSelected
      }
    default:
      return state;
  }
}