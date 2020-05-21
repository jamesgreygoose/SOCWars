/* Draws a pellet on to the canvas. The properties of the pellet are defined by the game server. An example can be seen below:

let examplePellet = {
  x: Math.floor(Math.random() * 3000),
  y: Math.floor(Math.random() * 1500),
  r: 10,
  color: "black",
}; */

function drawPellet(ctx, pellet) {
  const pelletSize = 20;
  const img = document.getElementById('SOC');
  ctx.drawImage(img, pellet.x - pelletSize, pellet.y - pelletSize, 40, 40);
}

export default drawPellet;
