const capitalize = ([firstLetter, ...restOfWord]: string) =>
  firstLetter.toUpperCase() + restOfWord.join("");

const sanitizeTitle = (title: string) => capitalize(title.replace("_", " "));

export { capitalize, sanitizeTitle };
