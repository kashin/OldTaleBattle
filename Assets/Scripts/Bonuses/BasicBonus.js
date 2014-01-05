
public class BasicBonus extends MonoBehaviour implements GameEventsListener
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcPlayer: PlayerBehavior;

public var mcGameDirector: GameDirector;

/// Bonus's life time in seconds.
public var mcLifeTime: float = 15.0f;

/*------------------------------------------ PROTECTED MEMBERS ------------------------------------------*/
protected var mcGameState: GameState = GameState.MainMenuShown;


/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mcDeathTime: float = 0.0f;

/*------------------------------------------ MONOBEHAVIOR ------------------------------------------*/
function OnDestroy()
{
  if (mcGameDirector)
  {
    mcGameDirector.removeGameEventsListener(this);
  }
}

function Start()
{
  if (mcPlayer == null)
  {
    var playerGameObject = GameObject.FindGameObjectWithTag("Player");
    if (playerGameObject)
    {
      mcPlayer = playerGameObject.GetComponent(PlayerBehavior);
    }
    else
    {
      Debug.LogError("BasicBonus.Start(): Player's GameObject not found");
    }
  }
  if (mcGameDirector == null)
  {
    var gameDirectorObject = GameObject.FindGameObjectWithTag("GameDirector");
    if (gameDirectorObject)
    {
      mcGameDirector = gameDirectorObject.GetComponent(GameDirector);
    }
    else
    {
      Debug.LogError("BasicBonus.Start(): GameDirector's GameObject not found");
    }
  }
  if (mcGameDirector)
  {
    mcGameDirector.addGameEventsListener(this);
  }
  mcDeathTime = Time.time + mcLifeTime;
}

function Update ()
{
  if ( (mcGameState == GameState.Playing || mcGameState == GameState.Tutorial) && mcDeathTime <= Time.time)
  {
    Destroy(gameObject);
  }
}

function OnTriggerEnter(other : Collider)
{
  Destroy(gameObject);
}
/*------------------------------------------ GameEventsListener INTERFACE ------------------------------------------*/
function onGameStateChanged(gameState: GameState)
{
  mcGameState = gameState;
  switch(gameState)
  {
    case GameState.Tutorial:
    case GameState.Playing:
      mcDeathTime = Time.time + mcLifeTime;
      break;
    default:
      if (mcDeathTime > Time.time)
      {
        mcLifeTime = mcDeathTime - Time.time;
      }
      break;
  }
}

}