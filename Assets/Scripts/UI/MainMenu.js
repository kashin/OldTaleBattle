
interface ApplicationSettingsListener
{
  function onSoundEnabledChanged(enabled: boolean);
  function onGameDifficultyChanged(gameDifficulty: GameDifficulty);
}

enum GameDifficulty
{
  Easy = 0,
  Normal,
  Hard,
  MaximumValue
}

public class MainMenu extends BasicUIComponent
{
/*------------------------------------------ GAME EVENTS LISTENER ------------------------------------------*/
public function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
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
public var mcMenuShownOnStart: boolean = false;

/*------------------------------------------ TEXT ------------------------------------------*/
public var mcAvailableLevels: String[];
public var mcAvailableLevelsNames: String[];
public var mcMainLabelText = "Old Tale Battle";
public var mcSettingsText = "Settings";
public var mcExitText = "Exit";

public var mcRandomMusicEnabledText = "Sound Enabled";
public var mcGameDifficultiesText = ["Easy", "Normal", "Hard"];


/*------------------------------------------ TEXTURES ------------------------------------------*/
public var mcMainMenuBackground: Texture2D;

/*------------------------------------------ STYLES ------------------------------------------*/
public var mcMainLabelStyle: GUIStyle;
public var mcMainMenuButtonsStyle: GUIStyle;

/*------------------------------------------ SIZES ------------------------------------------*/
// TODO: Sizes as percentage of a screen resolution?
public var mcButtonSize: Vector2 = Vector2(100, 60);
public var mcMainLabelSize: Vector2 = Vector2(400, 100);
public var mcSpaceBetweenButtons: int = 20;
public var mcSettingsValuesPos: Vector2 = Vector2(mcSpaceBetweenButtons, 100);

/*------------------------------------------ APPLICATION SETTINGS ------------------------------------------*/
// Contains a value to find out whether in-game music is enabled or not.
static var mcRandomMusicEnabled: boolean = true;
public function get RandomMusicEnabled(): boolean
{
  return mcRandomMusicEnabled;
}
public function set RandomMusicEnabled(value: boolean)
{
  if (value != mcRandomMusicEnabled)
  {
    mcRandomMusicEnabled = value;
    onSoundEnabledChanged(mcRandomMusicEnabled);
  }
}

static var mcGameDifficulty: GameDifficulty = 1;
public function get GameDifficulty(): GameDifficulty
{
  return mcGameDifficulty;
}
public function set GameDifficulty(value: GameDifficulty)
{
  if (value != mcGameDifficulty)
  {
    mcGameDifficulty = value;
    onGameDifficultyChanged(mcGameDifficulty);
  }
}



/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mcApplicationSettingsListeners = new List.<ApplicationSettingsListener>();

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
  mcGameDirectorComponent.requestChangeMainMenuState(mcMenuShownOnStart);
}

function Update()
{
  if (mcGameState != GameState.GameOver && Input.GetButtonDown("Main Menu"))
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
      var nextButtonPosY = 0;
      for (var i = 0; i < mcAvailableLevels.Length; i++)
      {
        var buttonsText = i < mcAvailableLevelsNames.Length ? mcAvailableLevelsNames[i] : mcAvailableLevels[i];
        if ( Application.loadedLevelName != mcAvailableLevels[i] )
        {
          if (GUI.Button(Rect(0, nextButtonPosY, mcButtonSize.x, mcButtonSize.y), buttonsText, mcMainMenuButtonsStyle) )
          {
            Application.LoadLevel(mcAvailableLevels[i]);
          }
          nextButtonPosY += mcButtonSize.y + mcSpaceBetweenButtons;
        }
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
  GUI.BeginGroup(Rect(0,0, mcScreenWidth, mcScreenHeight));
    GUI.DrawTexture(Rect(0,0, mcScreenWidth, mcScreenHeight), mcMainMenuBackground, ScaleMode.StretchToFill);
    GUI.Label(Rect(mcMainLabelPos.x, mcMainLabelPos.y, mcMainLabelSize.x, mcMainLabelSize.y), mcSettingsText, mcMainLabelStyle);
    GUI.BeginGroup(Rect(mcSettingsValuesPos.x, mcSettingsValuesPos.y + mcMainLabelPos.y, mcScreenWidth, mcScreenHeight));
      var elementPos = Vector2(mcSpaceBetweenButtons, mcSpaceBetweenButtons);
      RandomMusicEnabled = GUI.Toggle(Rect(elementPos.x , elementPos.y, mcButtonSize.x, mcButtonSize.y), RandomMusicEnabled, mcRandomMusicEnabledText);
      elementPos.y += mcButtonSize.y + mcSpaceBetweenButtons;
      GameDifficulty = GUI.Toolbar(Rect(elementPos.x, elementPos.y, mcMainLabelSize.x, mcMainLabelSize.y / 2), GameDifficulty, mcGameDifficultiesText);
    GUI.EndGroup();
  GUI.EndGroup();
}

/*------------------------------------------ Handling APPLICATION SETTINGS LISTENERS ------------------------------------------*/
public function addApplicationSettingsListener(listener: ApplicationSettingsListener)
{
  mcApplicationSettingsListeners.Add(listener);
  // calling onSoundEnabledChanged to make sure that listener is 'initialized' currectly.
  listener.onSoundEnabledChanged(mcRandomMusicEnabled);
}

public function removeApplicationSettingsListener(listener: ApplicationSettingsListener)
{
  mcApplicationSettingsListeners.Remove(listener);
}

private function onSoundEnabledChanged(enabled: boolean)
{
  for (var i = 0; i < mcApplicationSettingsListeners.Count; i++)
  {
    mcApplicationSettingsListeners[i].onSoundEnabledChanged(enabled);
  }
}
private function onGameDifficultyChanged(gameDifficulty: GameDifficulty)
{
  for (var i = 0; i < mcApplicationSettingsListeners.Count; i++)
  {
    mcApplicationSettingsListeners[i].onGameDifficultyChanged(gameDifficulty);
  }
}

} // MainMenu class

@script AddComponentMenu ("UI/Main Menu")
