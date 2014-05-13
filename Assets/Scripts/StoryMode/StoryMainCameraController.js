#pragma strict

public class StoryMainCameraController extends MonoBehaviour implements StoryTurnListener
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var player: Transform;
public var selfTransform: Transform;
public var storyTurnDirector: StoryTurnDirector;
public var hackForFieldOfViewPositioning: int = 0;

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var followPlayer: boolean = false;

// this value is used to position camera in battle 'correctly',
//so that player is shown on the left side of a screen.
private var cameraLeftAdditionalDistance: float = 2.0f;

/*------------------------------------------ MONOBEHAVIOR METHODS ------------------------------------------*/
function Start()
{
  selfTransform = transform;
  if (storyTurnDirector == null)
  {
    var storyDirectorObject = GameObject.FindGameObjectWithTag("StoryTurnDirector");
    storyTurnDirector = storyDirectorObject.GetComponent(StoryTurnDirector);
  }
  storyTurnDirector.addStoryTurnListener(this, true);

  // get angle between camera and player positions.
  var newQuaternion = new Quaternion();
  newQuaternion.SetLookRotation(player.position - selfTransform.position);

  // calculate a 'plane' distance to player. 'Plane' in this case means only in Z+X axis.
  var planeDistanceToPlayer = Vector3.Distance(selfTransform.position, player.position) * Mathf.Cos( Mathf.Deg2Rad * newQuaternion.eulerAngles.x );

  // Calculate world's point that is visible on a screen and located in left*0.2 and bottom*0.2 corner.
  var viewPortToWorldPoint = camera.ViewportToWorldPoint(Vector3(0.2f, 0.2f, planeDistanceToPlayer));

  // now let's calculate angle to this point.
  newQuaternion = new Quaternion();
  newQuaternion.SetLookRotation(viewPortToWorldPoint - selfTransform.position);
  cameraLeftAdditionalDistance = planeDistanceToPlayer * Mathf.Tan( Mathf.Deg2Rad * (360 - newQuaternion.eulerAngles.y) );
}

function Update()
{
  if (!followPlayer)
  {
    return;
  }
  selfTransform.position = Vector3(player.position.x, selfTransform.position.y, selfTransform.position.z);
}

/*------------------------------------------ STORY TURN LISTENER INTERFACE ------------------------------------------*/
  function onTurnStateChanged(newState: TurnState)
  {
    if (newState == TurnState.ExplorationMode)
    {
      followPlayer = true;
    }
    else
    {
      followPlayer = false;
      selfTransform.position = Vector3(player.position.x + cameraLeftAdditionalDistance, selfTransform.position.y, selfTransform.position.z);
    }
  }

}
@script AddComponentMenu ("Story/Story Main Camera Controller")