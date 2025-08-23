export const trimString = (value: string | undefined) => {
  if (value) {
    return value?.replace(/\s{2,}/g, ' ')?.trim();
  } else {
    return;
  }
};
