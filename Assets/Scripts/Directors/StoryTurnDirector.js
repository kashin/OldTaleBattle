#pragma strict

enum TurnState
{
  PlayerTurn,       // used when it is a player's turn
  EnemyTurn,        // used when it is a player's turn
  PlayerAnimation,  // used when Player's animation is going (between Player's turn and enemy's turn)
  EnemyAnimation    // used between enemy's and player's turns.
}

interface StoryTurnListener
{
  function onTurnStateChanged(newState: TurnState);
}

/// @brief This class represents a Turns Director for Story Mode. Basically it holds some usefull info for each turn and binds different components (like Actions and StoryPlayer) together.
/// Also it sends signals to all registered turn listeners.
public class StoryTurnDirector extends MonoBehaviour
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mPlayer: GameObject;



/*------------------------------------------ PROPERTIES ------------------------------------------*/
/// holds current turn state
var mTurnState: TurnState;
public function get CurrentTurnState(): TurnState
{
  return mTurnState;
}
/// Only director itself can set this value.
private function set CurrentTurnState(value: TurnState)
{
  if (mTurnState != value)
  {
    mTurnState = value;
    for (var i = 0; i < mTurnListeners.Count; i++)
    {
      mTurnListeners[i].onTurnStateChanged(mTurnState);
    }
  }
}

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/



/*------------------------------------------ MONOBEHAVIOR METHODS ------------------------------------------*/
function Start()
{
  if (mPlayer == null)
  {
    mPlayer = GameObject.FindGameObjectWithTag("Player");
  }
}


/*------------------------------------------ CUSTOM METHODS ------------------------------------------*/
/// triggered by timer and/or 'turn end' button
// TODO: button's interface
public function onPlayerTurnEnded()
{
  CurrentTurnState = TurnState.PlayerAnimation;
}

/// triggered by Player's animation controller
// TODO: Contorler's interface
public function onPlayerAnimationOver()
{
  CurrentTurnState = TurnState.EnemyTurn;
}

/// triggered by enemy controller
// TODO: Enemy controller's interface
public function onEnemyTurnEnded()
{
  CurrentTurnState = TurnState.EnemyAnimation;
}

/// triggered by Enemy's animation controller
// TODO: Enemy Contorler's interface
public function onEnemyAnimationOver()
{
  CurrentTurnState = TurnState.PlayerTurn;
}

/*------------------------------------------ LISTENERS ------------------------------------------*/
/// holds all currently attached game events listeners
private var mTurnListeners = new List.<StoryTurnListener>();
public function addStoryTurnListener(newListener: StoryTurnListener, initializeStateBySignal: boolean)
{
  mTurnListeners.Add(newListener);
  if (initializeStateBySignal)
  {
    newListener.onTurnStateChanged(CurrentTurnState);
  }
}

public function removeStoryTurnListener(listener: StoryTurnListener)
{
  mTurnListeners.Remove(listener);
}

}

@script AddComponentMenu ("UI/Story Turn Director")