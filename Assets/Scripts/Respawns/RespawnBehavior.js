#pragma strict
class RespawnBehavior extends MonoBehaviour implements GameEventsListener
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

/// Decrease spawn time to currentSpawnTime * mcDecreaseSpawnTime seconds.
public var mcDecreaseSpawnTime: float = 0.9;

private var mcMobsListSizeForRandom: int = 1;
private var mcItIsTimeToIncreaseListSize = true;
private var mcItIsTimeToSpawnNewMob = true;

private var mcStopRespawns: boolean = false;

function Start()
{
  updateSpawnNewMob();
  updateNextIncreaseMobsTime();
  var gameDirectorObject = GameObject.FindGameObjectWithTag("GameDirector");
  if (gameDirectorObject)
  {
    var gameDirector = gameDirectorObject.GetComponent(GameDirector);
    gameDirector.addGameEventsListener(this);
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

private function updateNextIncreaseMobsTime()
{
  if (mcItIsTimeToIncreaseListSize)
  {
    mcItIsTimeToIncreaseListSize = false;
    Invoke("increaseMobsListSizeForRandom", mcIncreaseMobsTime);
  }
}

private function updateSpawnNewMob()
{
  if (mcItIsTimeToSpawnNewMob)
  {
    mcItIsTimeToSpawnNewMob = false;
    Invoke("spawnNewMob", Random.Range(1.0f, mcMaxRespawnInTime) );
  }
}

protected function spawnNewMob()
{
  // it is time to spawn a new mob.
  var maxMobNumber = Mathf.Min(mcMobsListSizeForRandom, mcMobs.Length) - 1; // index is started from 0, so that's why we have -1.
  var index = Random.Range(0, maxMobNumber);
  var position = transform.position;
  var mob = Instantiate(mcMobs[index], position, transform.rotation);
  mob.GetComponent(MobsBehaviorComponent).mcPlayer = mcPlayer;
  mcItIsTimeToSpawnNewMob = true;
}

protected function increaseMobsListSizeForRandom()
{
  if (mcMobsListSizeForRandom < mcMobs.Length)
  {
    mcMobsListSizeForRandom++;
  }
  mcMaxRespawnInTime *= mcDecreaseSpawnTime; // decrease spawn time every mcIncreaseMobsTime seconds.
  mcItIsTimeToIncreaseListSize = true;
}

function onGameStateChanged(gameState: GameState)
{
  mcStopRespawns = gameState != GameState.Playing;
}

} // Respawn Behavior

@script AddComponentMenu ("Respawn/Respawn Behavior")