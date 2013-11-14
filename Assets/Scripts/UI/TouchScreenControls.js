#pragma strict

public class TouchScreenControls extends BasicUIComponent
{
/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcPlayersMotor: CharacterMotor;
public var mcPlayersTransform: Transform;
public var mcScreenControlsEnabled: boolean = false;
public var mcCharacterSpeed: float = 3.0;
public var mcMaxRotationSpeed: float = 540;

/*------------------------------------------ TEXTURES ------------------------------------------*/

// Arrows
public var mcLeftArrowStyle: GUIStyle;
public var mcRightArrowStyle: GUIStyle;
public var mcUpArrowStyle: GUIStyle;
public var mcDownArrowStyle: GUIStyle;

//Attacks
public var mcMeleeAttackStyle: GUIStyle;
public var mcMagicAttackStyle: GUIStyle;

/*------------------------------------------ SIZES ------------------------------------------*/

public var mcArrowControlSize: Vector2 = Vector2(50, 50);
public var mcButtonControlSize: Vector2 = Vector2(60, 60);


/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/

// position of an arrows group
private var mcArrowsPosition: Vector2 = Vector2(0, 0);
private var mcArrowsGroupSize: Vector2 = Vector2(0, 0);

// Arrows positions
private var mcLeftArrowPos: Vector2 = Vector2(0, 0);
private var mcUpArrowPos: Vector2 = Vector2(0, 0);
private var mcRightArrowPos: Vector2 = Vector2(0, 0);
private var mcDownArrowPos: Vector2 = Vector2(0, 0);

private var mcSpaceSize: int = 10;

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
  mcArrowsPosition.x = mcSpaceSize;
  mcArrowsPosition.y = Screen.height - 3 * mcArrowControlSize.y - 3 * mcSpaceSize;
  mcArrowsGroupSize.x = 3 * mcArrowControlSize.x + 2 * mcSpaceSize;
  mcArrowsGroupSize.y = 3 * mcArrowControlSize.y + 2 * mcSpaceSize;

  mcLeftArrowPos.x = 0;
  mcLeftArrowPos.y = mcArrowControlSize.y + mcSpaceSize;
  mcUpArrowPos.x = mcArrowControlSize.x + mcSpaceSize;
  mcUpArrowPos.y = 0;
  mcRightArrowPos.x = 2 * mcArrowControlSize.x + 2 * mcSpaceSize;
  mcRightArrowPos.y = mcLeftArrowPos.y;
  mcDownArrowPos.x = mcUpArrowPos.x;
  mcDownArrowPos.y = 2 * mcArrowControlSize.y + 2 * mcSpaceSize;
}

function OnGUI()
{
  if (!mcScreenControlsEnabled || mcGameState != GameState.Playing || !mcPlayersMotor)
  {
    //do nothing if screen controls are disabled or if we are not in a Playing game state
    // or we do not have a CharacterMotor.
    return;
  }

  // Arrows control.
  GUI.BeginGroup(Rect(mcArrowsPosition.x, mcArrowsPosition.y, mcArrowsGroupSize.x, mcArrowsGroupSize.y));
    if (GUI.RepeatButton(Rect(mcLeftArrowPos.x, mcLeftArrowPos.y, mcArrowControlSize.x, mcArrowControlSize.y), "", mcLeftArrowStyle))
    {
      if (mcCurrentHorizontalSpeed > -1.0f) // -1.0 is a minimum speed.
      {
        mcCurrentHorizontalSpeed -= 0.1f;
      }
      mcDecreaseHorizontalSpeed = false;
    }
    if (GUI.RepeatButton(Rect(mcRightArrowPos.x, mcRightArrowPos.y, mcArrowControlSize.x, mcArrowControlSize.y), "", mcRightArrowStyle))
    {
      if (mcCurrentHorizontalSpeed < 1.0f) // 1.0 is a maximum speed.
      {
        mcCurrentHorizontalSpeed += 0.1f;
      }
      mcDecreaseHorizontalSpeed = false;
    }
    if (GUI.RepeatButton(Rect(mcUpArrowPos.x, mcUpArrowPos.y, mcArrowControlSize.x, mcArrowControlSize.y), "", mcUpArrowStyle))
    {
      if (mcCurrentVerticalSpeed < 1.0f) // 1.0 is a maximum speed.
      {
        mcCurrentVerticalSpeed += 0.1f;
      }
      mcDecreaseVerticalSpeed = false;
    }
    if (GUI.RepeatButton(Rect(mcDownArrowPos.x, mcDownArrowPos.y, mcArrowControlSize.x, mcArrowControlSize.y), "", mcDownArrowStyle))
    {
      if (mcCurrentVerticalSpeed > -1.0f) // -1.0 is a minimum speed.
      {
        mcCurrentVerticalSpeed -= 0.1f;
      }
      mcDecreaseVerticalSpeed = false;
    }
  GUI.EndGroup();
}

function Update()
{
  var directionVector = Vector3(mcCurrentHorizontalSpeed, mcCurrentVerticalSpeed, 0.0f);
  updateCurrentSpeedValues();
  var speedyDirectionVector = getSpeedyDirectionVector(directionVector);
  Debug.Log("input value=" + speedyDirectionVector);
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
    if (mcCurrentVerticalSpeed < 0.0f)
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
    if (mcCurrentHorizontalSpeed < 0.0f)
    {
      mcCurrentHorizontalSpeed += 0.1f;
    }
    else
    {
      mcCurrentHorizontalSpeed -= 0.1f;
    }
  }
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
  // Set rotation to the move direction
  if (directionVector.sqrMagnitude > 0.01)
  {
    var newForward : Vector3 = ConstantSlerp(
      mcPlayersTransform.forward,
      directionVector,
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

@script AddComponentMenu ("UI/Touch Screen UI")