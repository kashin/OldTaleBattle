public class MainMenuTouchControl extends BaseTouchScreenControl
{

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/

// position of a move control
private var mcControlPosition: Vector2 = Vector2(0, 0);

private var mcSpaceSize: int = 30;



/*------------------------------------------ MONOBEHAVIOR IMPLEMENTATION ------------------------------------------*/
function Start ()
{
  super.Start();

  mcControlPosition.x = Screen.width / 2 - mcSpaceSize;
  mcControlPosition.y = Screen.height - mcSpaceSize - mcControlSize.y;
  guiTexture.pixelInset = Rect(mcControlPosition.x, mcControlPosition.y, mcControlSize.x, mcControlSize.y);
}

function Update ()
{
  if (!mcScreenControlEnabled || mcGameState != GameState.Playing)
  {
    //do nothing if screen controls are disabled or if we are not in a Playing game state
    return;
  }

  super.Update();
}


/*------------------------------------------ PROTECTED METHODS ------------------------------------------*/
protected function handleTouchBegan(touch: Touch)
{
  if (mcGameDirectorComponent)
  {
    // requesting to show a main menu.
    mcGameDirectorComponent.requestChangeMainMenuState(true);
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