
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

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/

/*------------------------------------------ TEXT ------------------------------------------*/
public var mcAvailableLevels: String[];
public var mcMainLabelText = "Old Tale Battle";
public var mcSettingsText = "Settings";
public var mcExitText = "Exit";


/*------------------------------------------ TEXTURES ------------------------------------------*/
public var mcMainMenuBackground: Texture2D;

/*------------------------------------------ STYLES ------------------------------------------*/
public var mcMainLabelStyle: GUIStyle;
public var mcMainMenuButtonsStyle: GUIStyle;

/*------------------------------------------ SIZES ------------------------------------------*/
// TODO: Sizes as percentage of a screen resolution?
public var mcButtonSize: Vector2 = Vector2(100, 50);
public var mcMainLabelSize: Vector2 = Vector2(400, 100);
public var mcSpaceBetweenButtons: int = 15;




/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mcMenuShown: boolean = false;
private var mcShowSettingsPage: boolean = false;
private var mcScreenWidth: int = 0;
private var mcScreenHeight: int = 0;
private var mcButtonsPos: Vector2 = Vector2(0, 0);
private var mcMainLabelPos: Vector2 = Vector2(0, 0);



/*------------------------------------------ MONOBEHAVIOUR ------------------------------------------*/
function Start()
{
  super.Start();
  mcScreenWidth = Screen.width;
  mcScreenHeight = Screen.height;
}

function Update()
{
  if (Input.GetButtonDown("Main Menu"))
  {
    if (mcShowSettingsPage)
    {
      /// Going back to a Main Menu from a settings page.
      mcShowSettingsPage = false;
    }
    else
    {
      /// Asking to close a Main Menu.
      mcGameDirectorComponent.requestChangeMainMenuState(!mcMenuShown);
    }
  }
}

function OnGUI()
{
  if (mcMenuShown)
  {
    mcMainLabelPos.x = (mcScreenWidth / 2) - (mcMainLabelSize.x /2);
    mcMainLabelPos.y = 0;

    mcButtonsPos.x = (mcScreenWidth / 2) - (mcButtonSize.x /2);
    mcButtonsPos.y = mcMainLabelPos.y + mcMainLabelSize.y;
    if (mcShowSettingsPage)
    {
      drawSettingsPage();
    }
    else
    {
      drawMainMenu();
    }
  }
}

/*------------------------------------------ DRAW METHODS ------------------------------------------*/

private function drawMainMenu()
{
  GUI.BeginGroup(Rect(0,0, mcScreenWidth, mcScreenHeight));
    // Draw MainMenu's background.
    GUI.DrawTexture(Rect(0,0, mcScreenWidth, mcScreenHeight), mcMainMenuBackground, ScaleMode.StretchToFill);
    GUI.Label(Rect(mcMainLabelPos.x, mcMainLabelPos.y, mcMainLabelSize.x, mcMainLabelSize.y), mcMainLabelText, mcMainLabelStyle);
    GUI.BeginGroup(Rect(mcButtonsPos.x, mcButtonsPos.y, mcScreenWidth, mcScreenHeight));
      // Draw MainMenu's buttons.
      var nextButtonPosY = mcButtonsPos.y;
      for (var i = 0; i < mcAvailableLevels.Length; i++)
      {
        if ( GUI.Button(Rect(0, nextButtonPosY, mcButtonSize.x, mcButtonSize.y), mcAvailableLevels[i], mcMainMenuButtonsStyle) )
        {
          if (Application.loadedLevelName != mcAvailableLevels[i])
          {
            Application.LoadLevel(mcAvailableLevels[i]);
          }
        }
        nextButtonPosY += mcButtonSize.y + mcSpaceBetweenButtons;
      }
      // Settings button.
      if ( GUI.Button(Rect(0, nextButtonPosY, mcButtonSize.x, mcButtonSize.y), mcSettingsText, mcMainMenuButtonsStyle) )
      {
        mcShowSettingsPage = true;
      }
      nextButtonPosY += mcButtonSize.y + mcSpaceBetweenButtons;
      // Exit button.
      if ( GUI.Button(Rect(0, nextButtonPosY, mcButtonSize.x, mcButtonSize.y), mcExitText, mcMainMenuButtonsStyle) )
      {
        Application.Quit();
      }
    GUI.EndGroup();
  GUI.EndGroup();
}

private function drawSettingsPage()
{
}

} // MainMenu class

@script AddComponentMenu ("UI/Main Menu")
