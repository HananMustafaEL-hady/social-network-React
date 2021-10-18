export default function getDate(Postdate) {
  const date = new Date(Postdate);
  console.log(Postdate);
  return `${date.getMonth() + 1}/ ${date.getDate()}/ ${date.getFullYear()}`;
}
