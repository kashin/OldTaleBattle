
public class BasicUIComponent extends MonoBehaviour implements GameEventsListener
{

public var mcGameDirector: GameObject;

protected var mcGameDirectorComponent: GameDirector;
protected var mcGameState: GameState = GameState.MainMenuShown;

function OnDestroy()
{
  if (mcGameDirectorComponent)
  {
    mcGameDirectorComponent.removeGameEventsListener(this);
  }
}

/// GameEventsListener implementation
public function onGameStateChanged(gameState: GameState)
{
  mcGameState = gameState;
}

function Start()
{
  updateGameDirector();
}

function updateGameDirector()
{
  if (mcGameDirector == null)
  {
    mcGameDirector = GameObject.FindGameObjectWithTag("GameDirector");
  }
  if (mcGameDirector)
  {
    mcGameDirectorComponent = mcGameDirector.GetComponent(GameDirector);
    mcGameDirectorComponent.addGameEventsListener(this);
  }
}


}
