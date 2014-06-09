#pragma strict

public class StoryEnemyController extends MonoBehaviour implements StoryTurnListener
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var storyTurnDirector: StoryTurnDirector;
public var playersTransform: Transform;
public var attackAnimation = "Attack";
public var castAnimation = "Jump";
public var idleAnimation = "idle";

public var distanceToPlayerToStartBattle: float = 35.0f;

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var playingAnimation: boolean = false;
private var mobAnimation: Animation;
private var sqrEngagePlayerOnDistance: float = 0.0f;

/*------------------------------------------ MONOBEHAVIOR METHODS ------------------------------------------*/
function Awake()
{
  sqrEngagePlayerOnDistance = distanceToPlayerToStartBattle * distanceToPlayerToStartBattle;
}

function Start()
{
  if (storyTurnDirector == null)
  {
    var turnObject = GameObject.FindGameObjectWithTag("StoryTurnDirector");
    if (turnObject != null)
    {
      storyTurnDirector = turnObject.GetComponent(StoryTurnDirector);
    }
  }
  if (playersTransform == null)
  {
    var playerObject = GameObject.FindGameObjectWithTag("Player");
    if (playerObject != null)
    {
      playersTransform = playerObject.GetComponent(Transform);
    } 	
  }
  mobAnimation = animation;
  mobAnimation.wrapMode = WrapMode.Loop;

  storyTurnDirector.addStoryTurnListener(this, true);
}

function Update()
{
  if (storyTurnDirector.CurrentTurnState == TurnState.ExplorationMode && 
      playerInBattleRange())
  {
    storyTurnDirector.onEnemyDetectedPlayer();
  }
}

/*------------------------------------------ PRIVATE METHODS ------------------------------------------*/

function playerInBattleRange(): boolean
{
  var vectorBetweenObjects = playersTransform.position - transform.position;
  // check whether player is close enough to us or not.
  // If yes then start inform StoryTurnDirector about it.
  return vectorBetweenObjects.sqrMagnitude < sqrEngagePlayerOnDistance;
}

/*------------------------------------------ STORY TURN LISTENER INTERFACE ------------------------------------------*/
function onTurnStateChanged(newState: TurnState)
{
  if (newState == TurnState.EnemyTurn)
  {
    // TODO: start AI logic
  }
}

}

@script AddComponentMenu ("Story mode/Story Mode Enemy Controller")