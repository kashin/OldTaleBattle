#pragma strict
class BonusSpawner extends MonoBehaviour implements GameEventsListener, ApplicationSettingsListener
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcMaxSpawnTime: float = 30.0f;
public var mcMinSpawnTime: float = 5.0f;

public var mcBonuses: GameObject[];


/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mcFieldSize: Vector2 = Vector2(0,0);
private var mcGameDirector: GameDirector;
private var mcMainMenuComponent: MainMenu;
private var mcNextSpawnTime: float = 0.0f; // holds time when next bonus should be created.
private var mcGameState: GameState;
private var mcGameDifficulty: GameDifficulty;
private var mcSpawnEnabled: boolean = true;


/*------------------------------------------ MONOBEHAVIOR ------------------------------------------*/
function OnDestroy()
{
  if (mcMainMenuComponent)
  {
    mcMainMenuComponent.removeApplicationSettingsListener(this);
  }
  if (mcGameDirector)
  {
    mcGameDirector.removeGameEventsListener(this);
  }
}

function Start()
{
  var gameDirectorObject = GameObject.FindGameObjectWithTag("GameDirector");
  if (gameDirectorObject)
  {
    var mcGameDirector = gameDirectorObject.GetComponent(GameDirector);
    if (mcGameDirector)
    {
      mcGameDirector.addGameEventsListener(this);
    }
  }
  else
  {
    Debug.LogError("BonusSpawner.Start(): GameDirector's GameObject not found");
  }
  var mainMenuObject = GameObject.FindGameObjectWithTag("MainMenu");
  if (mainMenuObject)
  {
    mcMainMenuComponent = mainMenuObject.GetComponent(MainMenu);
    if (mcMainMenuComponent)
    {
      mcMainMenuComponent.addApplicationSettingsListener(this);
    }
  }
  else
  {
    Debug.LogError("BonusSpawner.Start(): GameDirector's GameObject not found");
  }

  var cam = Camera.main;
  mcFieldSize.y = cam.orthographicSize;
  mcFieldSize.x = mcFieldSize.y * cam.aspect;
  var newPosition = cam.transform.position;
  newPosition.y = transform.position.y;
  transform.position = newPosition;

  updateNextSpawnTime();
}

function Update()
{
  if (mcSpawnEnabled && mcNextSpawnTime < Time.time)
  {
    spawnBonus();
  }
}

/*------------------------------------------ CUSTOM METHODS ------------------------------------------*/

private function updateNextSpawnTime()
{
  mcNextSpawnTime = Time.time + Random.Range(mcMinSpawnTime, mcMaxSpawnTime);
}

private function spawnBonus()
{
  if (mcBonuses.Length > 0)
  {
    var index: int = Random.Range(0, mcBonuses.Length);
    var position: Vector3 = transform.position;
    position.x += Random.Range(-mcFieldSize.x, mcFieldSize.x);
    position.z += Random.Range(-mcFieldSize.y, mcFieldSize.y);
    Instantiate(mcBonuses[index], position, transform.rotation);
  }
  updateNextSpawnTime();
}



/*------------------------------------------ GAME STATE LISTENER ------------------------------------------*/
function onGameStateChanged(gameState: GameState)
{
  mcGameState = gameState;
  switch(gameState)
  {
    case GameState.Tutorial:
    case GameState.Playing:
      mcNextSpawnTime = Time.time + mcNextSpawnTime;
      mcSpawnEnabled = true;
      break;
    default:
      if (mcNextSpawnTime > Time.time)
      {
        mcNextSpawnTime = mcNextSpawnTime - Time.time;
      }
      else
      {
        mcNextSpawnTime = 0.0f;
      }
      mcSpawnEnabled = false;
      break;
  }
}


/*------------------------------------------ APPLICATION SETTINGS LISTENER INTERFACE ------------------------------------------*/
function onSoundEnabledChanged(enabled: boolean)
{}

function onGameDifficultyChanged(gameDifficulty: GameDifficulty)
{
  mcGameDifficulty = gameDifficulty;
}

function onTouchControlsEnabledChanged(enabled: boolean)
{}

}

@script AddComponentMenu ("Respawn/Bonuses Spawn")