
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

protected function isScreenControlEnabled(): boolean
{
  return true;
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

}

@script RequireComponent (GUITexture)
@script AddComponentMenu ("UI/Story Mode Action")