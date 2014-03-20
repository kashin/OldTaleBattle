
public class BaseStoryAction extends BaseTouchScreenControl
{
/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mStoryUIDirector: StoryUIDirector;
public var mAttackObject: GameObject;
public var mTurnAction: GameObject;

/*------------------------------------------ TEXTURES ------------------------------------------*/
public var mPressedActionTexture: Texture;


/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mAttackStats: BasicAttackStats;
public function get AttackStats(): BasicAttackStats
{
  return mAttackStats;
}
public function set AttackStats(value: BasicAttackStats)
{
  mAttackStats = value;
}

/*------------------------------------------ MONOBEHAVIOR METHODS ------------------------------------------*/
function Start ()
{
  super.Start();
  if (mAttackObject != null)
  {
    var component = mAttackObject.GetComponent(ProjectileBehavior);
    if (component != null)
    {
      mAttackStats = component.AttackStats;
    }
  }
  else
  {
    Debug.LogWarning("Action do not have an attached attack object!");
  }
}

/*------------------------------------------ PROTECTED METHODS ------------------------------------------*/

function onTouchControlsEnabledChanged(enabled: boolean)
{
  mcScreenControlEnabled = enabled;
}

///---------- BaseTouchScreenControl protected methods
protected function handleTouchBegan(touch: Touch)
{
	setPressedState(true);
}

protected function handleTouchEnded(touch: Touch)
{
	actionPressed();
}

protected function handleOnMouseDown()
{
	setPressedState(true);
}

protected function handleOnMouseUp()
{
	actionPressed();
}

/*------------------------------------------ PRIVATE METHODS ------------------------------------------*/
private function actionPressed()
{
	if (mStoryUIDirector)
	{
		mStoryUIDirector.actionPressed(this);
	}
	setPressedState(false);
}

private function setPressedState(value: boolean)
{
	guiTexture.texture = value ? mPressedActionTexture : mcControlTexture;
}


/*------------------------------------------ GAME EVENTS LISTENER ------------------------------------------*/
public function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
  // action's visibility do not depend on application settings.
  guiTexture.enabled = (gameState == GameState.Playing || gameState == GameState.Tutorial);
}

}

@script RequireComponent (GUITexture)
@script AddComponentMenu ("UI/Story Mode Action")