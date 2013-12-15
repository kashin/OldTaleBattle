#pragma strict
class RespawnBehavior extends MonoBehaviour implements GameEventsListener, ApplicationSettingsListener
{
/// holds a list of mobs that can be spawned by this spawn point.
public var mcMobs: GameObject[];

public var mcPlayer: GameObject;

/*
 * At the beggining Spawn point spawns only 'first' type of mobs, then it spawns two types of mobs, etc.
 */
public var mcIncreaseMobsTime: float = 30.0f;

/// Maximum time between spawns.
public var mcMaxRespawnInTime: float = 30.0f;
public var mcMinRespawnInTime: float = 4.0f;

/// Decrease spawn time to currentSpawnTime * mcDecreaseSpawnTime seconds.
public var mcDecreaseSpawnTime: float = 0.9;

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mcMobsListSizeForRandom: int = 1;
private var mcIncreaseMobsStrength: int = 0; // mobs strength == base strength + mcIncreaseMobsStrength

private var mcItIsTimeToIncreaseListSize = true;
private var mcItIsTimeToSpawnNewMob = true;

private var mcStopRespawns: boolean = false;
private var mcGameDifficulty: GameDifficulty = GameDifficulty.Normal;

private var mcMainMenuComponent: MainMenu;

private var mcSpawnInvokeCalled: float = 0.0f;
private var mcSpawnMobInSeconds: float = 0.0f; // if 0, then we should generate a random number.

private var mcIncreaseListSizeCalled: float = 0.0f;
private var mcIncreaseListSizeInSeconds: float = 0.0f; // if 0, then we should generate a random number.

private var mcGameDirector: GameDirector;



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
    Debug.LogError("BasicDynamicGameObject.Start(): GameDirector's GameObject not found");
  }
  if (!mcStopRespawns)
  {
    updateSpawnNewMob();
    updateNextIncreaseMobsTime();
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
    Debug.LogError("BasicDynamicGameObject.Start(): GameDirector's GameObject not found");
  }
}

function Update()
{
  if (!mcStopRespawns)
  {
    updateNextIncreaseMobsTime();
    updateSpawnNewMob();
  }
}

/*------------------------------------------ SPAWN METHODS ------------------------------------------*/
private function updateNextIncreaseMobsTime()
{
  if (mcItIsTimeToIncreaseListSize)
  {
    mcItIsTimeToIncreaseListSize = false;
    var increaseMobsListSize = mcIncreaseMobsTime;
    if (mcIncreaseListSizeInSeconds != 0.0f)
    {
      increaseMobsListSize = mcIncreaseListSizeInSeconds;
    }
    Invoke("increaseMobsListSizeForRandom", increaseMobsListSize);
    mcIncreaseListSizeCalled = Time.time;
  }
}

private function updateSpawnNewMob()
{
  if (mcItIsTimeToSpawnNewMob)
  {
    mcItIsTimeToSpawnNewMob = false;
    // if 0, then we should generate a new random number, otherwise it means that
    // we are resuming our game (for example MainMenu is closed).
    if (mcSpawnMobInSeconds == 0.0f)
    {
      mcSpawnMobInSeconds = Random.Range(mcMinRespawnInTime, mcMaxRespawnInTime);
    }
    Invoke("spawnNewMob", mcSpawnMobInSeconds );
    mcSpawnInvokeCalled = Time.time;
  }
}

protected function spawnNewMob()
{
  // it is time to spawn a new mob.
  var maxMobNumber = Mathf.Min(mcMobsListSizeForRandom, mcMobs.Length); // index is started from 0, so that's why we have -1.
  var index = Random.Range(0, maxMobNumber);
  var position = transform.position;
  var mob = Instantiate(mcMobs[index], position, transform.rotation);
  var mobsStats = mob.GetComponent(MobsStats);
  if (mobsStats)
  {
    mobsStats.Strength += mcIncreaseMobsStrength;
    mobsStats.Difficulty = mcGameDifficulty;
  }
  var mobBehavior = mob.GetComponent(MobsBehaviorComponent);
  if (mobBehavior)
  {
    mobBehavior.mcPlayer = mcPlayer;
    if (mobsStats)
    {
      var strengthInfluence = (mobsStats.Strength - mobsStats.mcBaseStrength) / mobsStats.mcBaseStrength;
      mobBehavior.mcMobsSpeed *=  1.0f + strengthInfluence;
    }
  }
  mcItIsTimeToSpawnNewMob = true;
  mcSpawnMobInSeconds = 0.0f;
}

protected function increaseMobsListSizeForRandom()
{
  if (mcMobsListSizeForRandom <= mcMobs.Length)
  {
    mcMobsListSizeForRandom++;
    mcIncreaseMobsStrength++;
  }
  mcMaxRespawnInTime *= mcDecreaseSpawnTime; // decrease spawn time every mcIncreaseMobsTime seconds.
  if (mcMaxRespawnInTime < mcMinRespawnInTime)
  {
    mcMaxRespawnInTime = mcMinRespawnInTime;
  }
  mcItIsTimeToIncreaseListSize = true;
  mcIncreaseListSizeInSeconds = 0.0f;
}

/*------------------------------------------ GAME STATE LISTENER ------------------------------------------*/
function onGameStateChanged(gameState: GameState)
{
  mcStopRespawns = gameState != GameState.Playing && gameState != GameState.Tutorial;
  if (gameState == GameState.GameOver)
  {
    // just stop all current respawns.
    CancelInvoke();
  }
  else if (mcStopRespawns && !mcItIsTimeToSpawnNewMob)
  {
    // ok, 'safe' current respawn/increase list's size state and resume it later.
    mcSpawnMobInSeconds = (mcSpawnInvokeCalled + mcSpawnMobInSeconds) - Time.time;
    mcIncreaseListSizeInSeconds = (mcIncreaseListSizeCalled + mcIncreaseMobsTime) - Time.time;
    // and cancel current invoke.
    CancelInvoke();
    mcItIsTimeToSpawnNewMob = true;
    mcItIsTimeToIncreaseListSize = true;
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


} // Respawn Behavior

@script AddComponentMenu ("Respawn/Respawn Behavior")