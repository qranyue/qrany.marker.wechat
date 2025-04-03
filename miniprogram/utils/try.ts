export const tryPromise = async <P>(p: Promise<P>) => {
  try {
    return [await p] as const;
  } catch (error) {
    return [, error] as const;
  }
};
