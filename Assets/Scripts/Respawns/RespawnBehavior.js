#pragma strict

/// holds a list of mobs that can be spawned by this spawn point.
public var mcMobs: GameObject[];

/*
 * At the beggining Spawn point spawns only 'first' type of mobs, then it spawns two types of mobs, etc.
 */
public var mcIncreaseMobsTime: float = 30.0f;

/// Maximum time between spawns.
public var mcMaxRespawnInTime: float = 30.0f;

private var mcMobsListSizeForRandom: int = 1;
private var mcNextSpawnAtTime: float;
private var mcNextIncreaseMobsTime: float;

function Start()
{
  updateNextSpawnAtTime();
  updateNextIncreaseMobsTime();
}

function Update()
{
  if ( mcNextIncreaseMobsTime <= Time.time )
  {
    updateNextIncreaseMobsTime();
    if (mcMobsListSizeForRandom < mcMobs.Length)
    {
      mcMobsListSizeForRandom++;
    }
  }
  if ( mcNextSpawnAtTime <= Time.time )
  {
    // it is time to spawn a new mob.
    var maxMobNumber = Mathf.Min(mcMobsListSizeForRandom, mcMobs.Length) - 1; // index is started from 0, so that's why we have -1.
    var index = Random.Range(0, maxMobNumber);
    Instantiate(mcMobs[index], transform.position, transform.rotation);
    updateNextSpawnAtTime();
  }
}

private function updateNextIncreaseMobsTime()
{
  mcNextIncreaseMobsTime = Time.time + mcIncreaseMobsTime;
}

private function updateNextSpawnAtTime()
{
  mcNextSpawnAtTime = Time.time + Random.Range(1.0f, mcMaxRespawnInTime);
}