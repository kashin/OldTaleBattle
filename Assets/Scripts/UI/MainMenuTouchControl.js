public class MainMenuTouchControl extends BaseTouchScreenControl
{

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/

// position of a control
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
protected function handleOnMouseDown()
{
  openMainMenu();
}

protected function handleTouchBegan(touch: Touch)
{
  openMainMenu();
}

/*------------------------------------------ PRIVATE METHODS ------------------------------------------*/
private function openMainMenu()
{
  if (mcGameDirectorComponent)
  {
    // requesting to show a main menu.
    mcGameDirectorComponent.requestChangeMainMenuState(true);
  }
}

}

@script AddComponentMenu ("UI/Touch Screen Main Menu UI")