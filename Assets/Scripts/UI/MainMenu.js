
public class MainMenu extends BasicUIComponent
{
/*------------------------------------------ GAME EVENTS LISTENER ------------------------------------------*/
public function onGameStateChanged(gameState: GameState)
{
  switch(gameState)
  {
    case GameState.Playing:
    case GameState.FullScreenUIOpened:
    case GameState.GameOver:
      mcMenuShown = false;
      break;
    case GameState.MainMenuShown:
      mcMenuShown = true;
      break;
    default:
      Debug.LogError("unhandled enum value in MainMenu.onGameStateChanged");
      break;
  }
}




/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mcMenuShown: boolean = false;




/*------------------------------------------ MONOBEHAVIOUR ------------------------------------------*/
function Update()
{
  if (Input.GetButtonDown("Main Menu"))
  {
    mcGameDirectorComponent.requestChangeMainMenuState(!mcMenuShown);
  }
}

function OnGUI()
{
  if (mcMenuShown)
  {
    // TODO: draw Main Menu here.
  }
}

} // MainMenu class

@script AddComponentMenu ("UI/Main Menu")
