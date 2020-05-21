/* Draws a player on the the canvas. The properties of the player are defined by the game server. An example can be seen below: 

const examplePlayer = {
    x: Math.floor(Math.random() * 3000),
    y: Math.floor(Math.random() * 1500),
    r: 20,
    vx: 0,
    vy: 0,
    width: 50,
    height: 50,
    right: false,
    left: false,
    up: false,
    down: false,
    id: index,T
    health: 100,
    name: null,
    character: null,
    score: 0,
    power: 0,
    growthRate: 0.6,
  }*/

function drawPlayer(ctx, player) {
  if (!player) {
    //console.log('There is no player to draw!');
    return;
  }

  let character = null;

  if (player.left) {
    character = document.getElementById(player.character + 'Left');
  } else {
    character = document.getElementById(player.character);
  }

  ctx.fillStyle = 'white';
  ctx.font = '15px Verdana';
  ctx.strokeStyle = 'white';
  // ctx.fillStyle = 'rgba(255,255,255, 0.3)';
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.stroke();

  // 15 is just so the name doesnt overlap the player.health
  ctx.fillText(player.name, player.x - player.r, player.y - (player.r + 15));
  ctx.fillText(player.health, player.x - player.r, player.y - player.r);
  ctx.drawImage(
    character,
    player.x - player.r / 2 - player.r / 4,
    player.y - player.r / 2 - player.r / 4,
    player.r * 1.5,
    player.r * 1.5
  );
}

export default drawPlayer;
