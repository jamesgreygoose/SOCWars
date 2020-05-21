// The randomIndex function takes in an array and returns a random number between 0 and the length of the array.

function randomIndex(array) {
  let randomIndex = Math.floor(Math.random() * array.length);
  return randomIndex;
}

export default randomIndex;
