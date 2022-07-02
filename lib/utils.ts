const capitalize = (sentence: string) =>
  sentence.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

const sanitizeTitle = (title: string) =>
  capitalize(title.replace("_", " ").replace(`-`, " ").replace(`-`, " "));

export { capitalize, sanitizeTitle };
