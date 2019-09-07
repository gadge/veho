// Before 17 August 2018, in theaters around the world
const boxoffice = new Map([
  ['Avatar', 2787965087],
  ['Titanic', 2187463944],
  ['Star Wars: The Force Awakens', 2068223624],
  ['Avengers: Infinity War', 2045810611],
  ['Jurassic World', 1671713208],
  ['The Avengers', 1518812988],
  ['Furious 7', 1516045911],
  ['Avengers: Age of Ultron', 1405403694],
  ['Black Panther', 1346813040],
  ['Harry Potter & the Deathly Hallows II', 1341511219],
  ['Star Wars: The Last Jedi', 1332539889],
  ['Jurassic World: Fallen Kingdom', 1290473505]
])

const boxoffice_directors = new Map([
  ['Avatar', 'James Cameron'],
  ['Titanic', 'James Cameron'],
  ['Star Wars: The Force Awakens', 'J. J. Abrams'],
  ['Avengers: Infinity War', ['Anthony Russo', 'Joe Russo']],
  ['Jurassic World', 'Colin Trevorrow'],
  ['The Avengers', 'Joss Whedon'],
  ['Furious 7', 'James Wan'],
  ['Avengers: Age of Ultron', 'Joss Whedon'],
  ['Black Panther', 'Ryan Coogler'],
  ['Harry Potter & the Deathly Hallows II', 'David Yates'],
  ['Star Wars: The Last Jedi', 'Rian Johnson'],
  ['Jurassic World: Fallen Kingdom', 'J. A. Bayona']
])

export {
  boxoffice,
  boxoffice_directors
}