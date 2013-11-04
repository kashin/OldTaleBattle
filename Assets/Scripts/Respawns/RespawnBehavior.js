#pragma strict

/// holds a list of mobs that can be spawned by this spawn point.
public var mcMobs: GameObject[];

public var mcPlayer: GameObject;

/*
 * At the beggining Spawn point spawns only 'first' type of mobs, then it spawns two types of mobs, etc.
 */
public var mcIncreaseMobsTime: float = 30.0f;

/// Maximum time between spawns.
public var mcMaxRespawnInTime: float = 30.0f;

private var mcMobsListSizeForRandom: int = 1;
private var mcItIsTimeToIncreaseListSize = true;
private var mcItIsTimeToSpawnNewMob = true;

function Start()
{
  updateSpawnNewMob();
  updateNextIncreaseMobsTime();
}

function Update()
{
  updateNextIncreaseMobsTime();
  updateSpawnNewMob();
}

private function updateNextIncreaseMobsTime()
{
  if (mcItIsTimeToIncreaseListSize)
  {
    mcItIsTimeToIncreaseListSize = false;
    Invoke("increaseMobsListSizeForRandom", Time.time + mcIncreaseMobsTime);
  }
}

private function updateSpawnNewMob()
{
  if (mcItIsTimeToSpawnNewMob)
  {
    mcItIsTimeToSpawnNewMob = false;
    Invoke("spawnNewMob", Time.time + Random.Range(1.0f, mcMaxRespawnInTime) );
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
  mcMaxRespawnInTime *= 0.95; // decrease spawn time every mcIncreaseMobsTime seconds.
  mcItIsTimeToIncreaseListSize = true;
}