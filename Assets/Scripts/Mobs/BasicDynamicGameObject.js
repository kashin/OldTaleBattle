
public class BasicDynamicGameObject extends MonoBehaviour implements GameEventsListener
{
protected var mcMotor: CharacterMotor;
protected var mcCharacterController: CharacterController;

protected var mcGameLogicStoped: boolean = false;

private var mcGameDirector: GameDirector;

function OnDestroy()
{
  if (mcGameDirector)
  {
    mcGameDirector.removeGameEventsListener(this);
  }
}

function Awake()
{
  mcMotor = GetComponent(CharacterMotor);
  mcCharacterController = GetComponent(CharacterController);
}

function Start()
{
  var gameDirectorObject = GameObject.FindGameObjectWithTag("GameDirector");
  if (gameDirectorObject)
  {
    mcGameDirector = gameDirectorObject.GetComponent(GameDirector);
  }
  else
  {
    Debug.LogError("BasicDynamicGameObject.Start(): GameDirector's GameObject not found");
  }
  if (mcGameDirector)
  {
    mcGameDirector.addGameEventsListener(this);
  }
}

protected function onGameLogicStopedChanged(stoped: boolean)
{
  mcGameLogicStoped = stoped;
  var enabled = !mcGameLogicStoped;
  if (mcMotor != null)
  {
    mcMotor.enabled = enabled;
  }
  if (mcCharacterController != null)
  {
    mcCharacterController.enabled = enabled;
  }
  if (animation)
  {
    animation.enabled = enabled;
  }
}


/// GameEventsListener interface
public function onGameStateChanged(gameState: GameState)
{
  onGameLogicStopedChanged(gameState != GameState.Playing && gameState != GameState.Tutorial);
}

} // BasicDynamicGameObject
