export const getCurrent = () => {
  return getCurrentPages().slice(-1)[0];
};

export const getOption = () => {
  return getCurrent().options;
};
