#pragma strict

public class TouchScreenMoveControls extends BasicUIComponent
{
/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcPlayersMotor: CharacterMotor;
public var mcPlayersTransform: Transform;
public var mcScreenControlsEnabled: boolean = false;
public var mcCharacterSpeed: float = 3.0;
public var mcMaxRotationSpeed: float = 540;

/*------------------------------------------ TEXTURES ------------------------------------------*/

public var mcMoveControlTexture: Texture2D;

/*------------------------------------------ SIZES ------------------------------------------*/

public var mcMoveControlSize: Vector2 = Vector2(50, 50);


/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/

// position of a move control
private var mcMoveControlPosition: Vector2 = Vector2(0, 0);
private var mcMoveControlsCenterGlobalPosition: Vector2 = Vector2(0, 0);

private var mcSpaceSize: int = 30;

private var mcCurrentVerticalSpeed: float = 0.0f;
private var mcCurrentHorizontalSpeed: float = 0.0f;

private var mcDecreaseVerticalSpeed = true; // if true we should 'slow down' our input
private var mcDecreaseHorizontalSpeed = true; // if true we should 'slow down' our input



/*------------------------------------------ MONOBEHAVIOR ------------------------------------------*/
function Start()
{
  super.Start();
  if (!mcPlayersMotor || !mcPlayersTransform)
  {
    var playerObject = GameObject.FindGameObjectWithTag("Player");
    if (playerObject)
    {
      if (!mcPlayersMotor)
      {
        mcPlayersMotor = playerObject.GetComponent(CharacterMotor);
      }
      if (!mcPlayersTransform)
      {
        mcPlayersTransform = playerObject.transform;
      }
    }
  }
  mcMoveControlPosition.x = -(Screen.width / 2) + mcSpaceSize;
  mcMoveControlPosition.y = - (Screen.height / 2) + mcSpaceSize;
  guiTexture.pixelInset = Rect(mcMoveControlPosition.x, mcMoveControlPosition.y, mcMoveControlSize.x, mcMoveControlSize.y);
  guiTexture.texture = mcMoveControlTexture;
  mcMoveControlsCenterGlobalPosition.x = mcSpaceSize + mcMoveControlSize.x / 2;
  mcMoveControlsCenterGlobalPosition.y = mcSpaceSize + mcMoveControlSize.y / 2;
}

function Update()
{
  if (!mcScreenControlsEnabled || mcGameState != GameState.Playing || !mcPlayersMotor)
  {
    //do nothing if screen controls are disabled or if we are not in a Playing game state
    // or we do not have a CharacterMotor.
    return;
  }

  // Check whether user is pressing on a 'move control' or not.
  for (var i = 0; i < Input.touchCount; i++)
  {
    var touch = Input.GetTouch(i);
    var touchPosition = touch.position;
    if (guiTexture.HitTest(touchPosition))
    {
      if (touch.phase != TouchPhase.Canceled && touch.phase != TouchPhase.Ended)
      {
        // ok, we have a pressed state on a control, that's good.
        mcDecreaseVerticalSpeed = false;
        mcDecreaseHorizontalSpeed = false;
        mcCurrentHorizontalSpeed = (touchPosition.x - mcMoveControlsCenterGlobalPosition.x) / (mcMoveControlSize.x / 2);
        mcCurrentVerticalSpeed = (touchPosition.y - mcMoveControlsCenterGlobalPosition.y) / (mcMoveControlSize.y / 2);
      }
    }
  }


  // it is time to update move direction.
  var directionVector = Vector3(mcCurrentHorizontalSpeed, mcCurrentVerticalSpeed, 0.0f);
  updateCurrentSpeedValues();
  var speedyDirectionVector = getSpeedyDirectionVector(directionVector);
  mcPlayersMotor.inputMoveDirection = speedyDirectionVector;
  updateRotationFromDirectionVector(directionVector);

  mcDecreaseVerticalSpeed = true;
  mcDecreaseHorizontalSpeed = true;
}





/*------------------------------------------ CUSTOM METHODS ------------------------------------------*/
private function updateCurrentSpeedValues()
{

  if (mcDecreaseVerticalSpeed && mcCurrentVerticalSpeed != 0.0f)
  {
    if ( (mcCurrentVerticalSpeed > -0.11f && mcCurrentVerticalSpeed < 0.01f) ||
         (mcCurrentVerticalSpeed > 0.01f && mcCurrentVerticalSpeed < 0.11f) )
    {
      mcCurrentVerticalSpeed = 0.0f;
    }
    else if (mcCurrentVerticalSpeed < 0.0f)
    {
      mcCurrentVerticalSpeed += 0.1f;
    }
    else
    {
      mcCurrentVerticalSpeed -= 0.1f;
    }
  }

  if (mcDecreaseHorizontalSpeed && mcCurrentHorizontalSpeed != 0.0f)
  {
    if ( (mcCurrentHorizontalSpeed > -0.11f && mcCurrentHorizontalSpeed < 0.01f) ||
         (mcCurrentHorizontalSpeed > 0.01f && mcCurrentHorizontalSpeed < 0.11f) )
    {
      mcCurrentHorizontalSpeed = 0.0f;
    }
    else if (mcCurrentHorizontalSpeed < 0.0f)
    {
      mcCurrentHorizontalSpeed += 0.1f;
    }
    else
    {
      mcCurrentHorizontalSpeed -= 0.1f;
    }
  }
}

/*------------------------------------------ GAME EVENTS LISTENER ------------------------------------------*/
public function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
  guiTexture.enabled = gameState == GameState.Playing;
}



/*------------------------------------------ TOOK FROM PLATFORM INPUT CONTROLLER ------------------------------------------*/
private function getSpeedyDirectionVector(directionVector: Vector3): Vector3
{
  // NOTE: took it from PlatformInputController.js
  if (directionVector != Vector3.zero)
  {
    var directionLength = directionVector.magnitude;
    directionVector = directionVector / directionLength;

    directionLength = Mathf.Min(1, directionLength);
    directionLength = directionLength * directionLength;
    directionVector = directionVector * directionLength;
  }

 directionVector = Camera.main.transform.rotation * directionVector;
 
  // Rotate input vector to be perpendicular to character's up vector
  var camToCharacterSpace = Quaternion.FromToRotation(-Camera.main.transform.forward, mcPlayersTransform.up);
  directionVector = (camToCharacterSpace * directionVector);
  var speeedyDirectionVector = directionVector * mcCharacterSpeed;
  return speeedyDirectionVector;
}

function updateRotationFromDirectionVector(directionVector: Vector3)
{
  var directionForRotation = Vector3(directionVector.x, directionVector.z, directionVector.y);
  // Set rotation to the move direction
  if (directionForRotation.sqrMagnitude > 0.01)
  {
    var newForward : Vector3 = ConstantSlerp(
      mcPlayersTransform.forward,
      directionForRotation,
      mcMaxRotationSpeed * Time.deltaTime
    );
    var transformUpVector = mcPlayersTransform.up;
    newForward = ProjectOntoPlane(newForward, transformUpVector);
    mcPlayersTransform.rotation = Quaternion.LookRotation(newForward, transformUpVector);
 }
}

private function ProjectOntoPlane (v : Vector3, normal : Vector3)
{
  return v - Vector3.Project(v, normal);
}

private function ConstantSlerp (from : Vector3, to : Vector3, angle : float)
{
  var value : float = Mathf.Min(1, angle / Vector3.Angle(from, to));
  return Vector3.Slerp(from, to, value);
}

}

@script AddComponentMenu ("UI/Touch Screen Move UI")