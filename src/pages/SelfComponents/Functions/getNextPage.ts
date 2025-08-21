export default function getNextPage(nextPageUrl: string) {
  var parser = new URL(nextPageUrl);
  const newPage = parser?.search?.split("&")?.[0]?.split("=")?.[1];
  return parseInt(newPage);
}
