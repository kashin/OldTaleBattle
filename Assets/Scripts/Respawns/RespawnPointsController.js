#pragma strict
import System.Collections.Generic;

/// RespawnPointsController adds and removes spawn point, controlls thier available Mobs list, etc.

/// holds a list of mobs that can be spawned by spawn points.
public var mcMobs: GameObject[];
public var mcSpawnPoint: GameObject;

public var mcUseHardcodedSpawnPointsPositions: boolean = false;

/// Difference in X of where we can place spawn point compare to a controller's position
public var mcSpawnPointsX: float = 150;
/// Difference in Z of where we can place spawn point compare to a controller's position
public var mcSpawnPointsZ: float = 150;

public var mcNumberOfSpawnPoints: int = 10;


private var mcSpawnPoints = new List.<GameObject>();

function Awake()
{
  var cam = Camera.main;
  var maxSizeZ = cam.orthographicSize;
  var maxSizeX = maxSizeZ * cam.aspect;
  if (mcUseHardcodedSpawnPointsPositions)
  {
    // Let's make sure that hard coded values are not outside of a visible area.
    if (mcSpawnPointsX > maxSizeX)
    {
      mcSpawnPointsX = maxSizeX - 10.0f;
    }
    if (mcSpawnPointsZ > maxSizeZ)
    {
      mcSpawnPointsZ = maxSizeZ - 10.0f;
    }
  }
  else
  {
    mcSpawnPointsX = maxSizeX - 7.0f;
    mcSpawnPointsZ = maxSizeZ - 7.0f;
  }
}

function Start()
{
  var perimeter = mcSpawnPointsX * 4 + mcSpawnPointsZ * 4;
  var step = perimeter / mcNumberOfSpawnPoints;
  var currentXPosition = transform.position.x - mcSpawnPointsX;
  var currentZPosition = transform.position.z - mcSpawnPointsZ;
  var spawnPosition = transform.position;
  spawnPosition.x = currentXPosition;
  spawnPosition.z = currentZPosition;
  var stepState = 0;
  for (var i = 0; i < mcNumberOfSpawnPoints; i++)
  {
    var point = Instantiate(mcSpawnPoint, spawnPosition, Random.rotation);
    mcSpawnPoints.Add( point );
    point.GetComponent(RespawnBehavior).mcMobs = mcMobs;
    // TODO: fix this dump spawn points logic.
    switch(stepState)
    {
      case 0:
        var tmp = currentXPosition + step;
        if (tmp <= (transform.position.x + mcSpawnPointsX) )
        {
          currentXPosition = tmp;
        }
        else
        {
          tmp = tmp - (transform.position.x + mcSpawnPointsX);
          currentXPosition = transform.position.x + mcSpawnPointsX;
          currentZPosition += tmp;
          stepState++;
        }
        break;
      case 1:
        tmp = currentZPosition + step;
        if (tmp <= (transform.position.z + mcSpawnPointsZ) )
        {
          currentZPosition = tmp;
        }
        else
        {
          tmp -= (transform.position.z + mcSpawnPointsZ);
          currentZPosition = transform.position.z + mcSpawnPointsZ;
          currentXPosition -= tmp;
          stepState++;
        }
        break;
      case 2:
        tmp = currentXPosition - step;
        if (tmp >= (transform.position.x - mcSpawnPointsX) )
        {
          currentXPosition = tmp;
        }
        else
        {
          tmp = (transform.position.x - mcSpawnPointsX) - tmp;
          currentXPosition = transform.position.x - mcSpawnPointsX;
          currentZPosition -= tmp;
          stepState++;
        }
        break;
      case 3:
        tmp = currentZPosition - step;
        if (tmp >= (transform.position.z - mcSpawnPointsZ) )
        {
          currentZPosition = tmp;
        }
        else
        {
          tmp = (transform.position.z - mcSpawnPointsZ) - tmp;
          currentZPosition = transform.position.z - mcSpawnPointsZ;
          currentXPosition += tmp;
          stepState++;
        }
        break;
      default:
        stepState = 0;
        break;
    }
    spawnPosition.x = currentXPosition;
    spawnPosition.z = currentZPosition;
  }
}

@script AddComponentMenu ("Respawn/Respawn Points Controller")