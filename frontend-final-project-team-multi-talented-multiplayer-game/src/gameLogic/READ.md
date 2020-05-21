#Game Plan

- link Js file to html file
- create a canvas on html
- access canvas from Js file
- render background on canvas
- render player on canvas
- move player
- add websockets for 2 users over the internet

20 April 2020

/\* Add food pellets to the screen that players can eat to increase their size.

1. Generate x and y coordinates for the location of the food pellets DONE.
2. Put coordinates into object DONE.
3. Put food pellet objects into an array DONE.
4. Pellets are generated on backend, and are emitted to each client DONE.
5. When a player eats a pellet, that information is emitted to the backend DONE.
6. Every time a food pellet is eaten, the global pellet state is emitted to all clients DONE.
7. When a food pellets are eaten, some new pellets are generated.

How do player's eat pellets?

1. When a player collides with a pellet, they eat it.
2. This is measured using proximity between the x/y coordinates of the player and the pellet.
3. Using mathmatical equation we don't understand.

How are ne pellets generated?

1. Push new pellet on to the food pellet array.
2. Call this function on set interval the geenrate new pellets.\*/
