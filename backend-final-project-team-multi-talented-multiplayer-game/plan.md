We want players to be generated on the backend when a player joins the game, NOT when the server is started.

1. On the ENTER_GAME event player should be made OR pushed to the players array...or both?
2. playerIndex is not generated until player is generated, so that the player's index and their place in the array are identical.
3. Player is only generated when they enter the game, not when they join the game connection (i.e. logging in.)

---

We want players to be able win or lose the game.

How do we want them to win?

1. Last person standing (after two players or more have joined).

What needs to change in the code?

1. Player joins with health/size value.

   -this value already exists.

2. Health goes up when a player eats pellets.

   -when pellet is deleted on backend take in player that has eaten the pellet.
   -increase that player's size.
   -emit updated player to all other players.

3. On player collision player health decreases.

   -when player collision is registered on backend decrease player's health.
   -emit updated player health to all other players.

4. When health reaches zero, player dies (removed from activePlayers array) ---- activePlayers.splice(playerIndex, 1)

   -on backend, when two players collide check if their health has reached zero.
   -if health has reached zero, remove player from the game.

PLAN FOR GAME EVENTS

What is an event?

1. When someone health / knowledge reaches 0, thats a game event (both versions)
2. Time is about to run out.
3. When someone reaches a high number of points.
4. When someone joins the game.

- Create an html event element to display are events on screen.
- Want a funcion to populate them with an in-game event.
- Want to call that function with the correct information, at the correct time.

BUG FIXING

1. Currently there only appears to be one set of pellets for each room.
