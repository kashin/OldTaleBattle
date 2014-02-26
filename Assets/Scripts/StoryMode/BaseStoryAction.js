
public class BaseStoryAction extends BaseTouchScreenControl
{
/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mStoryUIDirector: StoryUIDirector;
public var mAttackObject: GameObject;

/*------------------------------------------ TEXTURES ------------------------------------------*/
public var mPressedActionTexture: Texture;


/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/


/*------------------------------------------ GAME EVENTS LISTENER ------------------------------------------*/
public function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
  // action's visibility do not depend on application settings.
  guiTexture.enabled = (gameState == GameState.Playing || gameState == GameState.Tutorial);
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


}

@script RequireComponent (GUITexture)
@script AddComponentMenu ("UI/Story Mode Action")