
/// GameDirector controls game's state (game over/main menu shown/hidden/etc.)
public class GameDirector extends MonoBehaviour implements PlayerStatsListener
{

/*--- Public members ---*/
public var mcPlayer: GameObject;





/*--- Private members ---*/





/*--- PLAYER STATS LISTENER INTERFACE ---*/
function onHealthChanged(health: int)
{
  if (health <= 0)
  {
    handlePlayerDeath();
  }
}

function onManaChanged(mana: int)
{}

function onLevelChanged(level: int)
{}





/*--- CUSTOM METHODS ---*/
function Start()
{
  if (mcPlayer == null)
  {
    mcPlayer = GameObject.FindGameObjectWithTag("Player");
  }
  if (mcPlayer)
  {
    var playerStats = mcPlayer.GetComponent(PlayerStats);
    if (playerStats)
    {
      playerStats.addPlayerStatsListener(this);
    }
  }
}



/*--- PRIVATE METHODS ---*/
private function handlePlayerDeath()
{
  ///TODO: stop game and show 'game over' + points + credits + etc.
}

}

@script AddComponentMenu ("In Game Director/Game Director")
