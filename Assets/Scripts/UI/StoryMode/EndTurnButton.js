#pragma strict

public class EndTurnButton extends BaseTouchScreenControl
{
/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
/// texture(s)
public var pressedStateTexture: Texture2D;
public var storyTurnDirector: StoryTurnDirector;



/*------------------------------------------ PROTECTED METHODS ------------------------------------------*/

///---------- BaseTouchScreenControl protected methods
protected function handleTouchBegan(touch: Touch)
{
  setPressedState(true);
}

protected function handleTouchEnded(touch: Touch)
{
  turnEndedPressed();
  setPressedState(false);
}

protected function handleOnMouseDown()
{
  setPressedState(true);
}

protected function handleOnMouseUp()
{
  turnEndedPressed();
  setPressedState(false);
}

protected function isScreenControlEnabled(): boolean
{
  return true;
}

/*------------------------------------------ PRIVATE METHODS ------------------------------------------*/

private function setPressedState(value: boolean)
{
  guiTexture.texture = value ? pressedStateTexture : mcControlTexture;
}

private function turnEndedPressed()
{
  storyTurnDirector.onPlayerTurnEnded();
}

}
@script RequireComponent (GUITexture);
@script AddComponentMenu ("UI/End Turn Button")