﻿#pragma strict

public class InGameUI extends BasicUIComponent implements PlayerStatsListener
{

/*------------------------------------------ SIZES ------------------------------------------*/
public var mcHealthBarPos: Vector2 = Vector2(10,20);
public var mcManaBarPos: Vector2 = Vector2(10,20);
public var mcBarSize : Vector2 = Vector2(50,20);

public var mcSkillsElementAutoSize: Vector2 = Vector2(0.25f, 0.15f);
public var mcIncreaseSkillButtonAutoSize: Vector2 = Vector2(0.05f, 0.05f);

// percentage of an element's height.
public var mcAutoSpaceBetweenElements: float = 0.15f;

public var mcGameOverTextSize: Vector2 = Vector2(200, 50);
public var mcGameOverStoryTextSize: Vector2 = Vector2(200, 200);
public var mcGameOverBackButtonSize: Vector2 = Vector2(200, 50);

public var mcBarLabelFontSize = 20;

public var mcBackButtonAutoSize: Vector2 = Vector2(0.1f, 0.08f);

/*------------------------------------------ TEXTS ------------------------------------------*/
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


/*------------------------------------------ STYLES ------------------------------------------*/
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
public var mcSkillsCamera: Camera;

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
}

function Update()
{
  if (Input.GetButtonDown("Open Skills"))
  {
    // Open skills screen if we are in a 'Playing' state and close it otherwise.
    changeSkillsScreenState();
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
  // Let's draw Skills page.
  drawLeftSkillsScreenSection();
  drawRightSkillsScreenSection();
}

/*------------------------------------------ DRAW GAME OVER STATE ------------------------------------------*/
private function drawGameOverUI()
{
  var spaceBetweenElelments: int = 20;
  GUI.BeginGroup(Rect(mcGameOverPos.x, mcGameOverPos.y, mcGameOverSize.x, mcGameOverSize.y));
    var middleOfArea = mcGameOverSize.x / 2;
    var nextPos = Vector2(spaceBetweenElelments, spaceBetweenElelments);
    GUI.DrawTexture(Rect(0, 0, mcGameOverSize.x, mcGameOverSize.y), mcGameOverBackgroundTexture, ScaleMode.StretchToFill);
    // Draw GameOver
    var mainLabelXPos = middleOfArea - nextPos.x - mcGameOverTextSize.x / 2;
    GUI.Label(Rect(mainLabelXPos, nextPos.y, mcGameOverTextSize.x, mcGameOverTextSize.y), mcGameOverMainLabelText, mcGameOverMainLabelStyle);
    nextPos.y += mcGameOverTextSize.y + spaceBetweenElelments;

    // Draw Score.
    GUI.Label(Rect(mainLabelXPos, nextPos.y, mcGameOverTextSize.x, mcGameOverTextSize.y), mcGameScoreText + " " + mcPlayerStats.Experience.ToString(), mcGameOverMainLabelStyle);
    nextPos.y += mcGameOverTextSize.y + spaceBetweenElelments;

    // Draw Game over story text.
    GUI.Label(Rect(middleOfArea - mcGameOverStoryTextSize.x /2 - nextPos.x, nextPos.y, mcGameOverStoryTextSize.x, mcGameOverStoryTextSize.y), mcGameOverText, mcGameOverTextStyle);
    nextPos.y += mcGameOverStoryTextSize.y + spaceBetweenElelments;

    if (GUI.Button(Rect(middleOfArea - mcGameOverBackButtonSize.x / 2 - nextPos.x, nextPos.y, mcGameOverBackButtonSize.x, mcGameOverBackButtonSize.y), mcGameOverBackButtonText))
    {
      Application.LoadLevel("MainMenu");
    }
  // TODO: safe result in a leader board.
  GUI.EndGroup();
}

/*------------------------------------------ DRAW HELPERS METHODS ------------------------------------------*/
private function drawLeftSkillsScreenSection()
{
  var spaceBetweenElements = 20;
  var rightButtonsMargin = mcIncreaseSkillButtonSize.x + 20;
  // Stats group.
  GUI.BeginGroup(Rect(0, 0, mcLeftSkillsSectionSize.x, mcLeftSkillsSectionSize.y));
    GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), mcLeftSkillsSectionTexture, ScaleMode.StretchToFill);
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
    GUI.DrawTexture(Rect(-mcRightSkillsSectionPos.x, -mcRightSkillsSectionPos.y, Screen.width, Screen.height), mcRightSkillsSectionTexture, ScaleMode.StretchToFill);
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
  if (mcGameState == GameState.Playing)
  {
    openSkillsScreen();
  }
  else if (mcGameState == GameState.FullScreenUIOpened)
  {
    closeSkillsScreen();
  }
}

///------------------------------------------ GAME EVENTS LISTENER INTERFACE ------------------------------------------///
function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
  mcSkillsCamera.enabled = gameState == GameState.FullScreenUIOpened;
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
