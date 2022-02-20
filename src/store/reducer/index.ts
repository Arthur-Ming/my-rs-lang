import audio from "./audio";
import textbook from "./textbook";
import nav from "./nav";
import dictionary from "./dictionary";

const reducer = {
  audio,
  textbook,
  nav,
  dictionary
} as const;

export default reducer