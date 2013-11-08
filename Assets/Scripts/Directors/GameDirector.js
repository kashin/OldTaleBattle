import System.Collections.Generic;

/// This enum's values represent current game's state ('game is paused', 'character menu is opened', etc.)
enum GameState
{
  MainMenuShown,
  Playing,
  FullScreenUIOpened,
  GameOver
}

/// Interface that is used to inform other components that game's state is changed.
interface GameEventsListener
{
  function onGameStateChanged(gameState: GameState);
}


/*------------------------------------------ GAME DIRECTOR ------------------------------------------*/
/// GameDirector controls game's state (game over/main menu shown/hidden/etc.)
public class GameDirector extends MonoBehaviour implements PlayerStatsListener
{
/*--- Public members ---*/
public var mcPlayer: GameObject;





/*------------------------------------------ Private members ------------------------------------------*/
/// holds current game state. Also used to 'initialize' newly added game events listeners.
private var mcCurrentGameState: GameState = GameState.MainMenuShown;

/// holds all currently attached game events listeners
private var mcGameEventsListeners = new List.<GameEventsListener>();





/*------------------------------------------ PLAYER STATS LISTENER INTERFACE ------------------------------------------*/
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

function onAvailableSkillPointsChanged(availablePoints: int)
{}




/*------------------------------------------ CUSTOM METHODS ------------------------------------------*/
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

/// called if someone wants to show Main Menu.
public function requestChangeMainMenuState(shown: boolean)
{
  // TODO: can we 'show full screen UI' and show Main Menu at the same time?
  onGameStateChanged(shown ? GameState.MainMenuShown : GameState.Playing);
}

public function requestChangeFullScreenUIState(open: boolean)
{
  // TODO: can we 'show full screen UI' and show Main Menu at the same time?
  onGameStateChanged(open ? GameState.FullScreenUIOpened : GameState.Playing);
}

/*------------------------------------------ Handling GAME EVENTS LISTENERS ------------------------------------------*/
public function addGameEventsListener(listener: GameEventsListener)
{
  mcGameEventsListeners.Add(listener);
  // calling game state changed to make sure that listener is 'initialized' currectly.
  listener.onGameStateChanged(mcCurrentGameState);
}

public function removeGameEventsListener(listener: GameEventsListener)
{
  mcGameEventsListeners.Remove(listener);
}

private function onGameStateChanged(gameState: GameState)
{
  mcCurrentGameState = gameState;
  for (var i = 0; i < mcGameEventsListeners.Count; i++)
  {
    mcGameEventsListeners[i].onGameStateChanged(mcCurrentGameState);
  }
}


/*------------------------------------------ PRIVATE METHODS ------------------------------------------*/
private function handlePlayerDeath()
{
  ///TODO: stop game and show 'game over' + points + credits + etc.
}

} // GameDirector class

@script AddComponentMenu ("In Game Director/Game Director")
