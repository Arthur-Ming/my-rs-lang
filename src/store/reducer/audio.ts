import { AUDIO_ACTIVE, AUDIO_DESACTIVE } from "../constants";

export default function (state: string, action: { type: string, id?: string }) {
  const { type, id = '' } = action

  switch (type) {
    case AUDIO_ACTIVE:
      return id
    case AUDIO_DESACTIVE:
      return ''
    default:
      return state;
  }
}