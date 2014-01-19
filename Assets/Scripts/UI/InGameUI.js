#pragma strict

public class InGameUI extends BasicUIComponent implements PlayerStatsListener
{

// Specifies how many rows do we have in our highscores board.
public var mcMaxHighScoreNumber: int = 5;

/*------------------------------------------ SIZES ------------------------------------------*/
public var mcHealthBarPos: Vector2 = Vector2(10,20);
public var mcManaBarPos: Vector2 = Vector2(10,20);
public var mcBarSize : Vector2 = Vector2(50,20);

public var mcSkillsElementAutoSize: Vector2 = Vector2(0.25f, 0.15f);
public var mcIncreaseSkillButtonAutoSize: Vector2 = Vector2(0.05f, 0.05f);

// percentage of an element's height.
public var mcAutoSpaceBetweenElements: float = 0.15f;

public var mcGameOverStoryTextSize: Vector2 = Vector2(200, 200);
public var mcGameOverButtonAutoSize: Vector2 = Vector2(0.2f, 0.08f);

public var mcBarLabelFontSize = 20;

public var mcBackButtonAutoSize: Vector2 = Vector2(0.1f, 0.08f);

public var mcHighScoreAutoSize: Vector2 = Vector2(0.8f, 0.08f);
public var mcInGameScoreAutoSize: Vector2 = Vector2(0.2f, 0.08f);

public var mcGameOverTextAutoSize: Vector2 = Vector2(0.8f, 0.07f);

/*------------------------------------------ TEXTS ------------------------------------------*/
public var mcNickForNewHighScore = "Player";

public var mcAvailableSkillPointsText = "Skill Points:";
public var mcStrengthSkillText = "Strength:";
public var mcIntelligentSkillText = "Intelligent:";
public var mcWillPowerSkillText = "Will Power:";

public var mcHealthValueText = "Health:";
public var mcManaValueText = "Mana:";
public var mcMeleeAttackValueText = "Melee damage:";
public var mcMagicAttackValueText = "Magic damage:";

public var mcGameOverMainLabelText = "Game Over";
public var mcGameScoreText = "Score:";
public var mcGameOverText = "Our hero is unconscious. Is it over or his friends and allies will help him? Maybe...";
public var mcGameOverBackButtonText = "Go to Main Menu";

public var mcBackButtonText = "Back";

public var mcSelectSpellText = "Selected Spell: ";


/*------------------------------------------ STYLES ------------------------------------------*/
public var mcInGameScoreTextStyle: GUIStyle;

public var mcSkillsLabelsStyle: GUIStyle;
public var mcBackButtonStyle: GUIStyle;

public var mcGameOverMainLabelStyle: GUIStyle;
public var mcGameOverTextStyle: GUIStyle;


/*------------------------------------------ TEXTURES ------------------------------------------*/
public var mcEmptyBar : Texture2D;
public var mcFullHealthBar : Texture2D;
public var mcFullManaBar : Texture2D;

// SKILLS SCREEN TEXTURES
public var mcLeftSkillsSectionTexture: Texture2D;
public var mcRightSkillsSectionTexture: Texture2D;


// GAME OVER TEXTURES
public var mcGameOverBackgroundTexture: Texture2D;

/*------------------------------------------ GAMEOBJECTS ------------------------------------------*/
/// @brief holds a ref on a Player's GameObject.
public var mcPlayer: GameObject;
public var mcPlayerInSkillsObject: GameObject;
public var mcSkillsCamera: Camera;
public var mcSpellsScreen: InGameSpellsScreen;


/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mcPlayerStats: PlayerStats;
private var mcHealthSize: float = 0.0f;
private var mcManaSize: float = 0.0f;

private var mcAvailableSkillPointsChanged: boolean = false;

private var mcLeftSkillsSectionSize: Vector2 = Vector2(0,0);

private var mcRightSkillsSectionSize: Vector2 = Vector2(0,0);
private var mcRightSkillsSectionPos: Vector2 = Vector2(0,0);

private var mcGameOverPos: Vector2 = Vector2(0, 0);
private var mcGameOverSize: Vector2 = Vector2(0, 0);

private var mcBarLabelStyle: GUIStyle;

private var mcBackButtonPos: Vector2 = Vector2(0, 0);
private var mcBackButtonSize: Vector2 = Vector2(100, 60);

private var mcSpaceBetweenElements: float = 30.0f;

private var mcSkillsElementSize: Vector2 = Vector2(200, 50);
private var mcIncreaseSkillButtonSize: Vector2 = Vector2(40, 40);

private var mcGameOverTextSize: Vector2 = Vector2(200, 50);

private var mcGameOverButtonSize: Vector2 = Vector2(200, 50);
private var mcGameOverSpaceBetweenElelements = 20;

private var mcHighScorePosX: int = 20;
private var mcHighScoreElementSize: Vector2 = Vector2(600, 60);

private var mcInGameScoreSize: Vector2 = Vector2(0, 0);


private var mcNewScorePosition: int = -1;

private var mcShowSpellsScreen: boolean  = false; // TODO: replace by an enum when needed.




/*------------------------------------------ MONOBEHAVIOR ------------------------------------------*/
function Start()
{
  super.Start();
  if (mcPlayer == null)
  {
    mcPlayer = GameObject.FindGameObjectWithTag("Player");
  }
  if (mcPlayer)
  {
    mcPlayerStats = mcPlayer.GetComponent(PlayerStats);
    if (mcPlayerStats)
    {
      mcPlayerStats.addPlayerStatsListener(this);
      // Update health value.
      mcHealthSize = mcPlayerStats.Health;
      mcHealthSize /=  mcPlayerStats.MaxHealth;

      // Update mana value.
      mcManaSize = mcPlayerStats.Mana;
      mcManaSize /=  mcPlayerStats.MaxMana;
    }
  }
  else
  {
    Debug.LogError("InGameUI: Player's object is not found!");
  }
  mcManaBarPos.x = Screen.width - mcBarSize.x - mcHealthBarPos.x;

  mcLeftSkillsSectionSize.x = Screen.width / 3;
  mcLeftSkillsSectionSize.y = Screen.height;
  mcRightSkillsSectionSize.x = Screen.width / 3;
  mcRightSkillsSectionSize.y = Screen.height;
  mcRightSkillsSectionPos.x = mcRightSkillsSectionSize.x * 2;

  // skills element size
  mcSkillsElementSize.x = Screen.width * mcSkillsElementAutoSize.x;
  if (mcSkillsElementSize.x > (mcLeftSkillsSectionSize.x - mcIncreaseSkillButtonSize.x) )
  {
    mcSkillsElementSize.x = mcLeftSkillsSectionSize.x;
  }
  mcSkillsElementSize.y = Screen.height * mcSkillsElementAutoSize.y;
  
  // increase skill button size
  mcIncreaseSkillButtonSize.x = Screen.width * mcIncreaseSkillButtonAutoSize.x;
  mcIncreaseSkillButtonSize.y = Screen.height * mcIncreaseSkillButtonAutoSize.y;

  mcGameOverPos.x = 0.0f;
  mcGameOverPos.y = 0.0f;

  mcGameOverSize.x = Screen.width;
  mcGameOverSize.y = Screen.height;
  
  mcSpaceBetweenElements = mcSkillsElementSize.y * mcAutoSpaceBetweenElements;
  
  // back button
  mcBackButtonSize.x = Screen.width * mcBackButtonAutoSize.x;
  mcBackButtonSize.y = Screen.height * mcBackButtonAutoSize.y;

  mcBackButtonPos.x = mcSpaceBetweenElements;
  mcBackButtonPos.y = Screen.height - mcBackButtonSize.y - 2 * mcSpaceBetweenElements;

  mcHighScoreElementSize.x = Screen.width * mcHighScoreAutoSize.x;
  mcHighScoreElementSize.y = Screen.height * mcHighScoreAutoSize.y;

  mcGameOverTextSize.x = Screen.width * mcGameOverTextAutoSize.x;
  mcGameOverTextSize.y = Screen.height * mcGameOverTextAutoSize.y;

  mcGameOverButtonSize.x = Screen.width * mcGameOverButtonAutoSize.x;
  mcGameOverButtonSize.y = Screen.height * mcGameOverButtonAutoSize.y;

  mcHighScorePosX = (Screen.width - mcHighScoreElementSize.x) / 2;

  mcInGameScoreSize.x = Screen.width * mcInGameScoreAutoSize.x;
  mcInGameScoreSize.y = Screen.height * mcInGameScoreAutoSize.y;

  if (mcSpellsScreen)
  {
    mcSpellsScreen.initializeSizesAndPositions();
  }
}

function Update()
{
  if (Input.GetButtonDown("Open Skills"))
  {
    // Open skills screen if we are in a 'Playing' state and close it otherwise.
    changeSkillsScreenState();
  }
  if (mcNewScorePosition > 0 && mcGameState == GameState.GameOver && Input.GetKeyDown("return"))
  {
    // so, we are showing a GameOver screen and user pressed return, plus we have non-saved new high score  => let's save it.
    saveNewScore();
  }
}

function OnGUI()
{
  if (mcBarLabelStyle == null)
  {
    mcBarLabelStyle = GUIStyle(GUI.skin.label);
    mcBarLabelStyle.fontSize = mcBarLabelFontSize;
  }

  switch(mcGameState)
  {
    case GameState.Tutorial:
    case GameState.Playing:
      drawPlayingStateUI();
      break;
    case GameState.FullScreenUIOpened:
      drawFullScreenInGameUI();
      break;
    case GameState.GameOver:
      drawGameOverUI();
      break;
    default:
      break;
  }
}

/*------------------------------------------ DRAW UI PRIVATE METHODS ------------------------------------------*/

/*------------------------------------------ DRAW PLAYING STATE ------------------------------------------*/
private function drawPlayingStateUI()
{
  // HEALTH BAR
  if (mcFullHealthBar && mcEmptyBar)
  {
    GUI.BeginGroup(Rect(mcHealthBarPos.x, mcHealthBarPos.y, mcBarSize.x, mcBarSize.y));
      GUI.DrawTexture(Rect(0, 0, mcBarSize.x, mcBarSize.y), mcEmptyBar, ScaleMode.StretchToFill);
      GUI.BeginGroup(Rect(2, 2, mcBarSize.x * mcHealthSize - 4, mcBarSize.y - 4));
        GUI.DrawTexture(Rect(0, 0, mcBarSize.x, mcBarSize.y), mcFullHealthBar, ScaleMode.StretchToFill);
      GUI.EndGroup();
      GUI.Label(Rect( mcBarSize.x / 4, 0, mcBarSize.x, mcBarSize.y), mcPlayerStats.Health.ToString(), mcBarLabelStyle);
    GUI.EndGroup();
  }
  // SCORE
  GUI.Label(Rect(mcHealthBarPos.x + mcBarSize.x + mcSpaceBetweenElements, mcHealthBarPos.y, mcInGameScoreSize.x, mcInGameScoreSize.y), mcGameScoreText + " " + mcPlayerStats.Experience.ToString(), mcInGameScoreTextStyle);

  // MANA BAR
  if (mcFullManaBar && mcEmptyBar)
  {
    GUI.BeginGroup(Rect(mcManaBarPos.x, mcManaBarPos.y, mcBarSize.x, mcBarSize.y));
      GUI.DrawTexture(Rect(0, 0, mcBarSize.x, mcBarSize.y), mcEmptyBar, ScaleMode.StretchToFill);
      GUI.BeginGroup(Rect(2, 2, mcBarSize.x * mcManaSize - 4, mcBarSize.y - 4));
        GUI.DrawTexture(Rect(0, 0, mcBarSize.x, mcBarSize.y), mcFullManaBar, ScaleMode.StretchToFill);
      GUI.EndGroup();
      GUI.Label(Rect(mcBarSize.x / 4, 0, mcBarSize.x, mcBarSize.y), mcPlayerStats.Mana.ToString(), mcBarLabelStyle);
    GUI.EndGroup();
  }
}

/*------------------------------------------ DRAW FULL SCREEN UI STATE ------------------------------------------*/
private function drawFullScreenInGameUI()
{
  if (mcShowSpellsScreen)
  {
    if (mcSpellsScreen)
    {
      mcShowSpellsScreen = !mcSpellsScreen.drawScreen();
      if (mcPlayerInSkillsObject)
      {
        mcPlayerInSkillsObject.active = !mcShowSpellsScreen;
      }
    }
  }
  else
  {
    // Let's draw Skills page.
    drawLeftSkillsScreenSection();
    drawRightSkillsScreenSection();
  }
}

/*------------------------------------------ DRAW GAME OVER STATE ------------------------------------------*/
private function drawGameOverUI()
{
  GUI.BeginGroup(Rect(mcGameOverPos.x, mcGameOverPos.y, mcGameOverSize.x, mcGameOverSize.y));
    var middleOfArea = mcGameOverSize.x / 2;
    var nextPos = Vector2(mcSpaceBetweenElements, mcSpaceBetweenElements);
    GUI.DrawTexture(Rect(0, 0, mcGameOverSize.x, mcGameOverSize.y), mcGameOverBackgroundTexture, ScaleMode.StretchToFill);
    // Draw GameOver
    var mainLabelXPos = middleOfArea - nextPos.x - mcGameOverTextSize.x / 2;
    GUI.Label(Rect(mainLabelXPos, nextPos.y, mcGameOverTextSize.x, mcGameOverTextSize.y), mcGameOverMainLabelText, mcGameOverMainLabelStyle);
    nextPos.y += mcGameOverTextSize.y + mcSpaceBetweenElements;

    // Draw Score.
    GUI.Label(Rect(mainLabelXPos, nextPos.y, mcGameOverTextSize.x, mcGameOverTextSize.y), mcGameScoreText + " " + mcPlayerStats.Experience.ToString(), mcGameOverMainLabelStyle);
    nextPos.y += mcGameOverTextSize.y + mcSpaceBetweenElements;

    // TODO: Draw Game over story text?

    // let's draw highscores board now.
    nextPos.y = drawHighScoreBoard(nextPos.y);

    if (GUI.Button(Rect(middleOfArea - mcGameOverButtonSize.x / 2 - nextPos.x, nextPos.y, mcGameOverButtonSize.x, mcGameOverButtonSize.y), "Save New Score"))
    {
      saveNewScore();
    }
    nextPos.y += mcGameOverButtonSize.y + mcSpaceBetweenElements;

    if (GUI.Button(Rect(middleOfArea - mcGameOverButtonSize.x / 2 - nextPos.x, nextPos.y, mcGameOverButtonSize.x, mcGameOverButtonSize.y), mcGameOverBackButtonText))
    {
      Application.LoadLevel("MainMenu");
    }
  GUI.EndGroup();
}

/*------------------------------------------ DRAW HELPERS METHODS ------------------------------------------*/
private function drawHighScoreBoard(posY: float): float
{
  var i: int = 0;
  var newHighScoreAdded: boolean = false;
  while(i < mcMaxHighScoreNumber)
  {
    if (i != mcNewScorePosition)
    {
      var position = newHighScoreAdded ? i - 1 : i;
      posY = drawExistedHighScore(posY, position);
    }
    else if (!newHighScoreAdded)
    {
      posY = drawNewHighScoreField(posY);
      newHighScoreAdded = true;
    }
    i++;
  }
  return posY;
}

private function drawExistedHighScore(posY: float, scorePosition: int): float
{
  var nickName: String = PrefsStorage.getHighScoreNick(scorePosition);
  var score = PrefsStorage.getHighScore(scorePosition);
  var labelText = (scorePosition + 1).ToString() + ". " + nickName + ": " + score.ToString();
  GUI.Label(Rect(mcHighScorePosX, posY, mcHighScoreElementSize.x, mcHighScoreElementSize.y), labelText, mcGameOverTextStyle);
  posY += mcHighScoreElementSize.y + mcSpaceBetweenElements;
  return posY;
}

private function drawNewHighScoreField(posY: float)
{
  mcNickForNewHighScore = GUI.TextField(Rect(mcHighScorePosX, posY, mcHighScoreElementSize.x, mcHighScoreElementSize.y), mcNickForNewHighScore);
  posY += mcHighScoreElementSize.y + mcSpaceBetweenElements;
  return posY;
}

private function drawLeftSkillsScreenSection()
{
  var spaceBetweenElements = 20;
  var rightButtonsMargin = mcIncreaseSkillButtonSize.x + 20;
  // Stats group.
  GUI.BeginGroup(Rect(0, 0, mcLeftSkillsSectionSize.x, mcLeftSkillsSectionSize.y));
    var nextLeftSectionPosition = Vector2(spaceBetweenElements, spaceBetweenElements); // TODO: remove hardcoded values...

    // Available skill points
    GUI.Label(Rect(nextLeftSectionPosition.x, nextLeftSectionPosition.y, mcSkillsElementSize.x, mcSkillsElementSize.y), mcAvailableSkillPointsText + " " + mcPlayerStats.AvailableSkillPoints.ToString(), mcSkillsLabelsStyle);
    nextLeftSectionPosition.y += mcSkillsElementSize.y + spaceBetweenElements; // TODO: remove hardcoded value...

    // Strength
    GUI.BeginGroup(Rect(nextLeftSectionPosition.x, nextLeftSectionPosition.y, mcSkillsElementSize.x, mcSkillsElementSize.y));
      GUI.Label(Rect(0, 0, mcSkillsElementSize.x - rightButtonsMargin, mcSkillsElementSize.y), mcStrengthSkillText + " " + mcPlayerStats.Strength.ToString(), mcSkillsLabelsStyle);
      if (mcPlayerStats.AvailableSkillPoints > 0 && GUI.Button(Rect(mcSkillsElementSize.x - rightButtonsMargin, 0, mcIncreaseSkillButtonSize.x, mcIncreaseSkillButtonSize.y), "+"))
      {
        mcPlayerStats.increaseStrength(1);
      }
    GUI.EndGroup();
    nextLeftSectionPosition.y += mcSkillsElementSize.y + spaceBetweenElements; // TODO: remove hardcoded value...

    // Intelligent
    GUI.BeginGroup(Rect(nextLeftSectionPosition.x, nextLeftSectionPosition.y, mcSkillsElementSize.x, mcSkillsElementSize.y));
      GUI.Label(Rect(0, 0, mcSkillsElementSize.x, mcSkillsElementSize.y), mcIntelligentSkillText + " " + mcPlayerStats.Intelligent.ToString(), mcSkillsLabelsStyle);
      if (mcPlayerStats.AvailableSkillPoints > 0 && GUI.Button(Rect(mcSkillsElementSize.x - rightButtonsMargin, 0, mcIncreaseSkillButtonSize.x, mcIncreaseSkillButtonSize.y), "+"))
      {
        mcPlayerStats.increaseIntelligent(1);
      }
    GUI.EndGroup();
    nextLeftSectionPosition.y += mcSkillsElementSize.y + spaceBetweenElements; // TODO: remove hardcoded value...

    // Will Power
    GUI.BeginGroup(Rect(nextLeftSectionPosition.x, nextLeftSectionPosition.y, mcSkillsElementSize.x, mcSkillsElementSize.y));
      GUI.Label(Rect(0, 0, mcSkillsElementSize.x, mcSkillsElementSize.y), mcWillPowerSkillText + " " + mcPlayerStats.WillPower.ToString(), mcSkillsLabelsStyle);
      if (mcPlayerStats.AvailableSkillPoints > 0 && GUI.Button(Rect(mcSkillsElementSize.x - rightButtonsMargin, 0, mcIncreaseSkillButtonSize.x, mcIncreaseSkillButtonSize.y), "+"))
      {
        mcPlayerStats.increaseWillPower(1);
      }
    GUI.EndGroup();
    nextLeftSectionPosition.y += mcSkillsElementSize.y + spaceBetweenElements; // TODO: remove hardcoded value...

/*
  /// TODO: Make Agility stat useful.
    // Agility
    GUI.BeginGroup(Rect(nextLeftSectionPosition.x, nextLeftSectionPosition.y, mcSkillsElementSize.x, mcSkillsElementSize.y));
      GUI.Label(Rect(0, 0, mcSkillsElementSize.x, mcSkillsElementSize.y), mcWillPowerSkillText + " " + mcPlayerStats.WillPower.ToString(), mcSkillsLabelsStyle);
      if (mcPlayerStats.AvailableSkillPoints > 0 && GUI.Button(Rect(mcSkillsElementSize.x - rightButtonsMargin, 0, mcIncreaseSkillButtonSize.x, mcIncreaseSkillButtonSize.y), "+"))
      {
        mcPlayerStats.increaseWillPower(1);
      }
    GUI.EndGroup();
    nextLeftSectionPosition.y += mcSkillsElementSize.y + 10; // TODO: remove hardcoded value...
*/

  // Back Button
  if (GUI.Button(Rect(mcBackButtonPos.x, mcBackButtonPos.y, mcBackButtonSize.x, mcBackButtonSize.y), mcBackButtonText, mcBackButtonStyle) )
  {
    // update Game's State.
    changeSkillsScreenState();
  }
  GUI.EndGroup();
}

private function drawRightSkillsScreenSection()
{
  var spaceBetweenElements = 20;
  // Stats group.
  GUI.BeginGroup(Rect(mcRightSkillsSectionPos.x, mcRightSkillsSectionPos.y, mcRightSkillsSectionSize.x, mcRightSkillsSectionSize.y));
    var nextRightSectionPosition = Vector2(spaceBetweenElements, spaceBetweenElements); // TODO: remove hardcoded values...

    // Current Player's Health
    GUI.Label(Rect(nextRightSectionPosition.x, nextRightSectionPosition.y, mcSkillsElementSize.x, mcSkillsElementSize.y), mcHealthValueText + " " + mcPlayerStats.Health.ToString(), mcSkillsLabelsStyle);
    nextRightSectionPosition.y += mcSkillsElementSize.y + spaceBetweenElements; // TODO: remove hardcoded value...

    // Current Player's Mana
    GUI.Label(Rect(nextRightSectionPosition.x, nextRightSectionPosition.y, mcSkillsElementSize.x, mcSkillsElementSize.y), mcManaValueText + " " + mcPlayerStats.Mana.ToString(), mcSkillsLabelsStyle);
    nextRightSectionPosition.y += mcSkillsElementSize.y + spaceBetweenElements; // TODO: remove hardcoded value...

    // Current Player's Melee Attack
    GUI.Label(Rect(nextRightSectionPosition.x, nextRightSectionPosition.y, mcSkillsElementSize.x, mcSkillsElementSize.y), mcMeleeAttackValueText + " " + mcPlayerStats.MeleeDamage.ToString(), mcSkillsLabelsStyle);
    nextRightSectionPosition.y += mcSkillsElementSize.y + spaceBetweenElements; // TODO: remove hardcoded value...

    // Current Player's Melee Attack
    GUI.Label(Rect(nextRightSectionPosition.x, nextRightSectionPosition.y, mcSkillsElementSize.x, mcSkillsElementSize.y), mcMagicAttackValueText + " " + mcPlayerStats.MagicDamage.ToString(), mcSkillsLabelsStyle);
    nextRightSectionPosition.y += mcSkillsElementSize.y + spaceBetweenElements; // TODO: remove hardcoded value...

    // Selected spell button
    var currentSpellName = "";
    if (mcPlayerStats.MagicAttack)
    {
      var magicBehavior = mcPlayerStats.MagicAttack.GetComponent(BasicMagicAttackBehavior);
      currentSpellName = magicBehavior.Name;
    }
    if (GUI.Button(Rect(nextRightSectionPosition.x, nextRightSectionPosition.y, mcSkillsElementSize.x, mcSkillsElementSize.y), mcSelectSpellText + currentSpellName, mcBackButtonStyle) )
    {
      mcShowSpellsScreen = true;
    }
  GUI.EndGroup();
}

///------------------------------------------ CUSTOM METHODS ------------------------------------------///
private function openSkillsScreen()
{
  mcGameDirectorComponent.requestChangeFullScreenUIState(true);
}

private function closeSkillsScreen()
{
  mcGameDirectorComponent.requestChangeFullScreenUIState(false);
}

public function changeSkillsScreenState()
{
  if (mcGameState == GameState.Playing || mcGameState == GameState.Tutorial)
  {
    openSkillsScreen();
  }
  else if (mcGameState == GameState.FullScreenUIOpened)
  {
    closeSkillsScreen();
  }
}

private function updateHighScorePosition()
{
  var highScoreValue = mcPlayerStats.Experience;
  var position: int  = -1;
  for (var i = 0; i < mcMaxHighScoreNumber; i++)
  {
    var score = PrefsStorage.getHighScore(i);
    if (highScoreValue > score)
    {
      mcNewScorePosition = i;
      break;
    }
  }
}

private function saveNewScore()
{
  PrefsStorage.saveNewScore(mcNewScorePosition, mcNickForNewHighScore, mcPlayerStats.Experience, mcMaxHighScoreNumber);
  mcNewScorePosition = -1;
}

///------------------------------------------ GAME EVENTS LISTENER INTERFACE ------------------------------------------///
function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
  mcSkillsCamera.enabled = gameState == GameState.FullScreenUIOpened;
  if (gameState == GameState.GameOver)
  {
    updateHighScorePosition();
  }
}


///------------------------------------------ PlayerStats listener interface ------------------------------------------///
function onHealthChanged(health: int)
{
  // Update health value.
  mcHealthSize = health;
  mcHealthSize /=  mcPlayerStats.MaxHealth;
}

function onManaChanged(mana: int)
{
  // Update mana value.
  mcManaSize = mana;
  mcManaSize /=  mcPlayerStats.MaxMana;
}

function onLevelChanged(level: int)
{}

function onAvailableSkillPointsChanged(availablePoints: int)
{}

} // InGameUI class

@script AddComponentMenu ("UI/In-Game UI")
