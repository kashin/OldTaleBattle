
interface ApplicationSettingsListener
{
  function onSoundEnabledChanged(enabled: boolean);
  function onGameDifficultyChanged(gameDifficulty: GameDifficulty);
  function onTouchControlsEnabledChanged(enabled: boolean);
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
    case GameState.Tutorial:
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

public var mcTouchControlsEnabledByDefault: boolean = false;

/*------------------------------------------ TEXT ------------------------------------------*/
public var mcAvailableLevels: String[];
public var mcAvailableLevelsNames: String[];
public var mcMainLabelText = "Old Tale Battle";
public var mcSettingsText = "Settings";
public var mcExitText = "Exit";
public var mcBackButtonText = "Go Back";

/// Settings texts
public var mcRandomMusicEnabledText = "Sound Enabled";
public var mcGameDifficultiesText = ["Easy", "Normal", "Hard"];
public var mcTouchControlsEnabledText = "Touch Controls Enbaled";


/*------------------------------------------ TEXTURES ------------------------------------------*/
public var mcMainMenuBackground: Texture2D;
public var mcLoadingScreenTexture: GameObject;

/*------------------------------------------ STYLES ------------------------------------------*/
public var mcMainLabelStyle: GUIStyle;
public var mcMainMenuButtonsStyle: GUIStyle;

/*------------------------------------------ SIZES ------------------------------------------*/
// Auto sizes ==  percentage of a screen size.
public var mcButtonAutoSize: Vector2 = Vector2(0.2f, 0.15f);
public var mcMainLabelAutoSize: Vector2 = Vector2(0.4f, 0.1f);
public var mcBackButtonAutoSize: Vector2 = Vector2(0.1f, 0.08f);

// Auto space between buttons is a percentage of a Button's height.
public var mcSpaceBetweenButtonsAuto: float = 0.1f;

public var mcSettingsValuesPos: Vector2 = Vector2(0, 100);



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
    PrefsStorage.storeIntKey(mcRandomMusicKey, value ? 1 : 0);
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
    PrefsStorage.storeIntKey(mcGameDifficultyKey, mcGameDifficulty);
    onGameDifficultyChanged(mcGameDifficulty);
  }
}

static var mcTouchControlsEnabled: boolean = false;
public function get TouchControlsEnabled(): boolean
{
  return mcTouchControlsEnabled;
}
public function set TouchControlsEnabled(value: boolean)
{
  if (value != mcTouchControlsEnabled)
  {
    mcTouchControlsEnabled = value;
    PrefsStorage.storeIntKey(mcTouchControlsEnabledKey, value ? 1 : 0);
    onTouchControlsEnabledChanged(mcTouchControlsEnabled);
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
private var mcBackButtonPos: Vector2 = Vector2(0, 0);

private var mcButtonSize: Vector2 = Vector2(100, 60);
private var mcBackButtonSize: Vector2 = Vector2(100, 60);
private var mcMainLabelSize: Vector2 = Vector2(400, 100);
private var mcSpaceBetweenButtons: int = 20;

private var mcGameDifficultyKey = "GameDifficulty";
private var mcRandomMusicKey = "SoundEnabled";
private var mcTouchControlsEnabledKey = "TouchControlsEnabled";

private var mcLoadLevelName = "";
private var mcNeedInvokeLevel: boolean = false;


/*------------------------------------------ MONOBEHAVIOUR ------------------------------------------*/
function Start()
{
  super.Start();

  Input.gyro.enabled = false; // good for power consumption since we don't gyroscope atm.

  mcScreenWidth = Screen.width;
  mcScreenHeight = Screen.height;

  mcGameDirectorComponent.requestChangeMainMenuState(mcMenuShownOnStart);

  // Buttons
  mcButtonSize.x = mcScreenWidth * mcButtonAutoSize.x;
  mcButtonSize.y = mcScreenHeight * mcButtonAutoSize.y;

  mcSpaceBetweenButtons = mcButtonSize.y * mcSpaceBetweenButtonsAuto;
  mcSettingsValuesPos.x = mcSpaceBetweenButtons;

  var maxButtonHeight = mcScreenHeight / (mcAvailableLevels.Length + 3); // magic number 3 is 'exit + settins + back' buttons.
  if (mcButtonSize.y > maxButtonHeight)
  {
    mcButtonSize.y = maxButtonHeight;
  }

  // Back button
  mcBackButtonSize.x = mcScreenWidth * mcBackButtonAutoSize.x;
  mcBackButtonSize.y = mcScreenHeight * mcBackButtonAutoSize.y;

  mcBackButtonPos.x = mcSpaceBetweenButtons;
  mcBackButtonPos.y = mcScreenHeight - mcBackButtonSize.y - mcSpaceBetweenButtons;

  // Main label
  mcMainLabelSize.x = mcScreenWidth * mcMainLabelAutoSize.x;
  mcMainLabelSize.y = mcScreenWidth * mcMainLabelAutoSize.y;

  mcMainLabelPos.x = (mcScreenWidth / 2) - (mcMainLabelSize.x /2);
  mcMainLabelPos.y = 0;

  // Button's pos
  mcButtonsPos.x = (mcScreenWidth / 2) - (mcButtonSize.x /2);
  mcButtonsPos.y = mcMainLabelPos.y + mcMainLabelSize.y;

  GameDifficulty = PrefsStorage.getIntKey(mcGameDifficultyKey, 1);
  RandomMusicEnabled = PrefsStorage.getIntKey(mcRandomMusicKey, 1) == 1;
  TouchControlsEnabled = PrefsStorage.getIntKey(mcTouchControlsEnabledKey, mcTouchControlsEnabledByDefault ? 1 : 0) == 1;

  mcLoadingScreenTexture.guiTexture.pixelInset.width = Screen.width;
  mcLoadingScreenTexture.guiTexture.pixelInset.height = Screen.height;
}

function Update()
{
  if (mcNeedInvokeLevel)
  {
    Invoke("onLoadGameLevel", 0.5f);
    mcNeedInvokeLevel = false;
  }
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

/*------------------------------------------ DRAW MAINMENU ------------------------------------------*/
private function drawMainMenu()
{
  GUI.BeginGroup(Rect(0,0, mcScreenWidth, mcScreenHeight));
    var currentLevelName = Application.loadedLevelName;
    // Draw MainMenu's background.
    GUI.DrawTexture(Rect(0,0, mcScreenWidth, mcScreenHeight), mcMainMenuBackground, ScaleMode.ScaleAndCrop);
    GUI.Label(Rect(mcMainLabelPos.x, mcMainLabelPos.y, mcMainLabelSize.x, mcMainLabelSize.y), mcMainLabelText, mcMainLabelStyle);
    // Buttons group
    GUI.BeginGroup(Rect(mcButtonsPos.x, mcButtonsPos.y, mcScreenWidth, mcScreenHeight));
      // Draw MainMenu's buttons.
      var nextButtonPosY = 0;
      for (var i = 0; i < mcAvailableLevels.Length; i++)
      {
        var buttonsText = i < mcAvailableLevelsNames.Length ? mcAvailableLevelsNames[i] : mcAvailableLevels[i];
        if ( currentLevelName != mcAvailableLevels[i] )
        {
          if (GUI.Button(Rect(0, nextButtonPosY, mcButtonSize.x, mcButtonSize.y), buttonsText, mcMainMenuButtonsStyle) )
          {
            mcLoadingScreenTexture.active = true;
            mcLoadLevelName = mcAvailableLevels[i];
            mcMenuShown = false;
            mcNeedInvokeLevel = true;
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
    GUI.EndGroup(); // buttons group

    // Draw Back button only if we can 'go back' which is mean on all levels except 'MainMenu' level.
    if ( currentLevelName != "MainMenu")
    {
      if (GUI.Button(Rect(mcBackButtonPos.x, mcBackButtonPos.y, mcBackButtonSize.x, mcBackButtonSize.y), mcBackButtonText, mcMainMenuButtonsStyle) )
      {
        // Level is already running, let's close Main Menu then.
        // Asking GameDirector to close a Main Menu.
        mcGameDirectorComponent.requestChangeMainMenuState(!mcMenuShown);
      }
    }

  GUI.EndGroup();
}

/*------------------------------------------ DRAW SETTINGS ------------------------------------------*/
private function drawSettingsPage()
{
  GUI.BeginGroup(Rect(0,0, mcScreenWidth, mcScreenHeight));
    GUI.DrawTexture(Rect(0,0, mcScreenWidth, mcScreenHeight), mcMainMenuBackground, ScaleMode.StretchToFill);
    GUI.Label(Rect(mcMainLabelPos.x, mcMainLabelPos.y, mcMainLabelSize.x, mcMainLabelSize.y), mcSettingsText, mcMainLabelStyle);

    // Draw settings
    GUI.BeginGroup(Rect(mcSettingsValuesPos.x, mcSettingsValuesPos.y + mcMainLabelPos.y, mcScreenWidth, mcScreenHeight));
      var elementPos = Vector2(mcSpaceBetweenButtons, 0);

/* too lazy to make my own assets for toggle button, so had to use few ugly tricks to increase size of a default toggle button*/
/// Start of ugly hack
      var style = GUIStyle(GUI.skin.toggle);
      style.fontSize = 18;
      style.border = RectOffset(0,0,0,0);
      style.onNormal.textColor = Color.white;
      style.imagePosition = ImagePosition.ImageLeft;
      var toggleButtonSize = mcButtonSize.x / 3;
      style.overflow = RectOffset(-toggleButtonSize * 2.3,-toggleButtonSize * 3.3, -mcButtonSize.y / 2 + toggleButtonSize / 3.0 , -mcButtonSize.y / 2 + toggleButtonSize / 25.0);
      style.padding.left = mcButtonSize.x;
      style.padding.top = 10;
/// End of ugly hack

      RandomMusicEnabled = GUI.Toggle(Rect(elementPos.x , elementPos.y, mcButtonSize.x * 2, mcButtonSize.y), RandomMusicEnabled, mcRandomMusicEnabledText, style);
      elementPos.y += mcButtonSize.y + mcSpaceBetweenButtons;

      var gameDifficultyYSize = mcMainLabelSize.y / 2;
      GameDifficulty = GUI.Toolbar(Rect(elementPos.x, elementPos.y, mcMainLabelSize.x, gameDifficultyYSize), GameDifficulty, mcGameDifficultiesText);
      elementPos.y += gameDifficultyYSize + mcSpaceBetweenButtons;
      
      TouchControlsEnabled = GUI.Toggle(Rect(elementPos.x , elementPos.y, mcButtonSize.x * 2, mcButtonSize.y), TouchControlsEnabled, mcTouchControlsEnabledText, style);
    GUI.EndGroup();

    // Draw Back button.
    if (GUI.Button(Rect(mcBackButtonPos.x, mcBackButtonPos.y, mcBackButtonSize.x, mcBackButtonSize.y), mcBackButtonText, mcMainMenuButtonsStyle) )
    {
      mcShowSettingsPage = !mcShowSettingsPage;
    }
  GUI.EndGroup();
}




/*------------------------------------------ CUSTOM METHODS ------------------------------------------*/
private function onLoadGameLevel()
{
    Application.LoadLevel(mcLoadLevelName);
    mcLoadLevelName = "";
    mcNeedInvokeLevel = false;
}



/*------------------------------------------ Handling APPLICATION SETTINGS LISTENERS ------------------------------------------*/
public function addApplicationSettingsListener(listener: ApplicationSettingsListener)
{
  mcApplicationSettingsListeners.Add(listener);
  // calling onXXXXChanged to make sure that listener is 'initialized' currectly.
  listener.onSoundEnabledChanged(RandomMusicEnabled);
  listener.onGameDifficultyChanged(GameDifficulty);
  listener.onTouchControlsEnabledChanged(TouchControlsEnabled);
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

private function onTouchControlsEnabledChanged(touchControlsEnabled: boolean)
{
  for (var i = 0; i < mcApplicationSettingsListeners.Count; i++)
  {
    mcApplicationSettingsListeners[i].onTouchControlsEnabledChanged(touchControlsEnabled);
  }
}

} // MainMenu class

@script AddComponentMenu ("UI/Main Menu")
