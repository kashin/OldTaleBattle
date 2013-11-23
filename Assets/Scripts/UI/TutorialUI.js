public class TutorialUI extends BasicUIComponent
{

public var mcShowTutorialOnStart: boolean = true;

public var mcTutorialText = "Press K to perform a Melee Attack \n"
                          + "Press M to perform a Magic Attack \n"
                          + "Press W, A, S, D to move your character \n"
                          + "Press C to open skills screen \n"
                          + "Press 'backspace' to open the main menu. \n";

public var mcTutorialTextAutoSize: Vector2 = Vector2(0.8f, 0.6f);

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
    GUI.Box(Rect(mcTutorialTextPos.x, mcTutorialTextPos.y, mcTutorialTextSize.x, mcTutorialTextSize.y), mcTutorialText);
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

}
@script AddComponentMenu ("UI/Tutorial UI")
