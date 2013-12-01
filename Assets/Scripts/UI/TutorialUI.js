public class TutorialUI extends BasicUIComponent implements ApplicationSettingsListener
{

public var mcShowTutorialOnStart: boolean = true;

public var mcMainMenuComponent: MainMenu;

public var mcTutorialText = "Press K to perform a Melee Attack \n"
                          + "Press M to perform a Magic Attack \n"
                          + "Press W, A, S, D to move your character \n"
                          + "Press C to open skills screen \n"
                          + "Press 'backspace' to open the main menu. \n";

public var mcTouchTutorialText = "Use circle control for movement\n"
                               + "Use 'Sword' button to perform a melee attack\n"
                               + "Use 'magic' button to perform a magic attack\n"
                               + "use other on screen buttons to open skills screen or main menu.";

public var mcShowTouchScreenTutorial: boolean = false;
public var mcTutorialTextAutoSize: Vector2 = Vector2(0.8f, 0.6f);
public var mcTutorialFontSize: int  = 20;

private var mcTutorialTextSize: Vector2 = Vector2(0, 0);
private var mcTutorialTextPos: Vector2 = Vector2(0, 0);

private var mcRequestShowTutorial: boolean = false;


function Start()
{
  super.Start();
  if (mcShowTutorialOnStart)
  {
    mcRequestShowTutorial = mcShowTutorialOnStart;
  }

  if (mcMainMenuComponent == null)
  {
    var mainMenuObject = GameObject.FindGameObjectWithTag("MainMenu");
    mcMainMenuComponent = mainMenuObject.GetComponent(MainMenu);
  }
  if (mcMainMenuComponent)
  {
    mcMainMenuComponent.addApplicationSettingsListener(this);
  }
  else
  {
    Debug.LogError("Main Menu compoennt is not found");
  }

  mcTutorialTextSize.x = Screen.width * mcTutorialTextAutoSize.x;
  mcTutorialTextSize.y = Screen.height * mcTutorialTextAutoSize.y;

  mcTutorialTextPos.x = (Screen.width - mcTutorialTextSize.x) / 2;
  mcTutorialTextPos.y = (Screen.height - mcTutorialTextSize.y) / 2;
}

function Update()
{
  if (mcRequestShowTutorial)
  {
    changeShowTutorial();
  }
}

function OnGUI()
{
  if (mcGameState == GameState.Tutorial)
  {
    var style = GUIStyle(GUI.skin.box);
    style.fontSize = mcTutorialFontSize;
    GUI.Box(Rect(mcTutorialTextPos.x, mcTutorialTextPos.y, mcTutorialTextSize.x, mcTutorialTextSize.y), mcShowTouchScreenTutorial ? mcTouchTutorialText: mcTutorialText, style);
  }
}

/// GameEventsListener implementation
public function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
  if (gameState == gameState.Playing)
  {
    changeShowTutorial();
  }
}

private function changeShowTutorial()
{
  mcGameDirectorComponent.requestChangeTutorialState(true);
  mcRequestShowTutorial = false;
}

/*------------------------------------------ APPLICATION SETTINGS LISTENER ------------------------------------------*/
function onTouchControlsEnabledChanged(enabled: boolean)
{
  mcShowTouchScreenTutorial = enabled;
}

function onSoundEnabledChanged(enabled: boolean)
{}

function onGameDifficultyChanged(gameDifficulty: GameDifficulty)
{}

}
@script AddComponentMenu ("UI/Tutorial UI")
