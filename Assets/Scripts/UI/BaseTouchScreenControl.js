public class BaseTouchScreenControl extends BasicUIComponent
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcScreenControlEnabled: boolean = false;

/*------------------------------------------ TEXTURES ------------------------------------------*/
public var mcControlTexture: Texture2D;

/*------------------------------------------ SIZES ------------------------------------------*/
public var mcControlSize: Vector2 = Vector2(100, 100);


/*------------------------------------------ MONOBEHAVIOR IMPLEMENTATION ------------------------------------------*/
function Start ()
{
  super.Start();
  guiTexture.texture = mcControlTexture;
}

function Update ()
{
  if (!mcScreenControlEnabled || mcGameState != GameState.Playing)
  {
    //do nothing if screen controls are disabled or if we are not in a Playing game state
    return;
  }

  // Check whether user is pressed on this control or not.
  for (var i = 0; i < Input.touchCount; i++)
  {
    var touch = Input.GetTouch(i);
    var touchPosition = touch.position;
    if (guiTexture.HitTest(touchPosition))
    {
      switch(touch.phase)
      {
        case TouchPhase.Began:
          handleTouchBegan(touch);
          break;
        case TouchPhase.Moved:
          handleTouchMoved(touch);
          break;
        case TouchPhase.Stationary:
          handleTouchStationary(touch);
          break;
        case TouchPhase.Ended:
          handleTouchEnded(touch);
          break;
        case TouchPhase.Canceled:
          handleTouchCanceled(touch);
          break;
        default:
          break;
      }
      if (touch.phase == TouchPhase.Began)
      {
        // ok, user pressed on a control, handling press now.
      }
    }
  }
}



/*------------------------------------------ PROTECTED METHODS ------------------------------------------*/
// Empty here, should be overriden by other classes
protected function handleTouchBegan(touch: Touch)
{}

protected function handleTouchMoved(touch: Touch)
{}

protected function handleTouchStationary(touch: Touch)
{}

protected function handleTouchEnded(touch: Touch)
{}

protected function handleTouchCanceled(touch: Touch)
{}

/*------------------------------------------ GAME EVENTS LISTENER ------------------------------------------*/
public function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
  guiTexture.enabled = gameState == GameState.Playing;
}

}
