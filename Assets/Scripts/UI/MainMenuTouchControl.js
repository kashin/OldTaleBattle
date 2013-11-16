public class MainMenuTouchControl extends BasicUIComponent
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcScreenControlEnabled: boolean = false;

/*------------------------------------------ TEXTURES ------------------------------------------*/
public var mcControlTexture: Texture2D;

/*------------------------------------------ SIZES ------------------------------------------*/
public var mcControlSize: Vector2 = Vector2(100, 100);



/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/

// position of a move control
private var mcControlPosition: Vector2 = Vector2(0, 0);
private var mcControlsCenterGlobalPosition: Vector2 = Vector2(0, 0);

private var mcSpaceSize: int = 30;




/*------------------------------------------ MONOBEHAVIOR IMPLEMENTATION ------------------------------------------*/
function Start ()
{
  super.Start();

  mcControlPosition.x = Screen.width / 2 - mcSpaceSize;
  mcControlPosition.y = Screen.height - mcSpaceSize - mcControlSize.y;
  guiTexture.pixelInset = Rect(mcControlPosition.x, mcControlPosition.y, mcControlSize.x, mcControlSize.y);
  guiTexture.texture = mcControlTexture;
  mcControlsCenterGlobalPosition.x = mcControlPosition.x;
  mcControlsCenterGlobalPosition.y = mcControlPosition.y;
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
      if (touch.phase == TouchPhase.Began)
      {
        // ok, user pressed on a control, handling press now.
        if (mcGameDirectorComponent)
        {
          // requesting to show a main menu.
          mcGameDirectorComponent.requestChangeMainMenuState(true);
        }
      }
    }
  }
}


/*------------------------------------------ GAME EVENTS LISTENER ------------------------------------------*/
public function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
  guiTexture.enabled = gameState == GameState.Playing;
}

}

@script AddComponentMenu ("UI/Touch Screen Main Menu UI")