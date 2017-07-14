export function compareStrings(str1, str2) {
  if (str1 < str2) return -1;
  if (str2 < str1) return 1;
  return 0;
}
