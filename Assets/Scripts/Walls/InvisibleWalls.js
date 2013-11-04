#pragma strict

/// Holds a 'number' of a wall. 0 == Left wall, 1 == Upper Wall, etc.
public var mcWallNumber: int = 0;
public var mcWallScreenEdgePadding: float = 0.0f;

function Awake()
{
  var cam = Camera.main;
  var height = 2.0f * cam.orthographicSize;
  var width = height * cam.aspect;
  var xPosition: float = 0.0f;
  var zPosition: float = 0.0f;
  switch(mcWallNumber)
  {
    case 0:
      xPosition = (-width / 2) + mcWallScreenEdgePadding;
      break;
    case 1:
      zPosition = (height / 2) + mcWallScreenEdgePadding;
      break;
    case 2:
      xPosition = (width / 2) + mcWallScreenEdgePadding;
      break;
    case 3:
      zPosition = (-height / 2) + mcWallScreenEdgePadding;
      break;
    default:
      break;
  }
  transform.position.x += xPosition;
  transform.position.z += zPosition;
}
