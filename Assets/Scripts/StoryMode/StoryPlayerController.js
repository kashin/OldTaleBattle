#pragma strict

public class StoryPlayerController extends MonoBehaviour implements StoryTurnListener
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var storyTurnDirector: StoryTurnDirector;
public var storyUIDirector: StoryUIDirector;
public var attackAnimation = "Attack";
public var castAnimation = "Jump";
public var idleAnimation = "idle";

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var turnActions: List.<BaseStoryAction> = new List.<BaseStoryAction>();
private var playingAnimation: boolean = false;
private var playerAnimation: Animation;

private var currentActionEnumerator = turnActions.GetEnumerator();


/*------------------------------------------ MONOBEHAVIOR METHODS ------------------------------------------*/
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
  if (storyUIDirector == null)
  {
    var uiObject = GameObject.FindGameObjectWithTag("StoryUIDirector");
    if (uiObject != null)
    {
      storyUIDirector = uiObject.GetComponent(StoryUIDirector);
    }
  }
  playerAnimation = animation;
  storyTurnDirector.addStoryTurnListener(this, true);
}

function Update()
{
  if (playingAnimation && !playerAnimation.isPlaying)
  {
    playNextAction();
  }
}

/*------------------------------------------ PRIVATE METHODS ------------------------------------------*/
/// simply calls appropriate TurnDirector's method to change TurnState.
private function startEnemyTurn()
{
  storyTurnDirector.onPlayerAnimationOver();
  playingAnimation = false;
  playerAnimation.wrapMode = WrapMode.Loop;
  playerAnimation.CrossFade("idle");
}

/// gather actions for a current turn and starts their playback
private function startAnimationSequence()
{
  // first we need to get actions that we are about to 'play'
  turnActions = storyUIDirector.TurnActions;
  playerAnimation.wrapMode = WrapMode.Once;
  playerAnimation.Stop();
  playingAnimation = true;
  currentActionEnumerator = turnActions.GetEnumerator();
  playNextAction();
}

private function playNextAction()
{
  // 'Pop' action from a turn's list and start it's animation.
  // Start enemy's turn if zero actions left.
  if (currentActionEnumerator.MoveNext())
  {
    var actionPosition = transform.position + transform.forward * 3.0f + transform.up * 4.0f;
    Instantiate(currentActionEnumerator.Current.mAttackObject, actionPosition, transform.rotation);
    playerAnimation.Play(attackAnimation);
  }
  else
  {
    startEnemyTurn();
  }
}

/*------------------------------------------ STORY TURN LISTENER INTERFACE ------------------------------------------*/
function onTurnStateChanged(newState: TurnState)
{
  if (newState == TurnState.PlayerAnimation)
  {
    startAnimationSequence();
  }
}

}

@script AddComponentMenu ("Story mode/Story Mode Player Controller")
