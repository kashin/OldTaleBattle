﻿#pragma strict

public class InGameUI extends BasicUIComponent implements PlayerStatsListener
{

// Sizes
public var mcHealthBarPos: Vector2 = new Vector2(10,20);
public var mcManaBarPos: Vector2 = new Vector2(10,20);
public var mcBarSize : Vector2 = new Vector2(50,20);

// Textures
public var mcEmptyBar : Texture2D;
public var mcFullHealthBar : Texture2D;
public var mcFullManaBar : Texture2D;

/// @brief holds a ref on a Player's GameObject.
public var mcPlayer: GameObject;

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mcPlayerStats: PlayerStats;
private var mcHealthSize: float = 0.0f;
private var mcManaSize: float = 0.0f;

/*------------------------------------------ MONOBEHAVIOR ------------------------------------------*/
function Awake()
{
  if (mcFullHealthBar)
  {
    mcFullHealthBar.wrapMode = TextureWrapMode.Repeat;
  }
  if (mcFullManaBar)
  {
    mcFullManaBar.wrapMode = TextureWrapMode.Repeat;
  }
}

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
}

function OnGUI()
{
  switch(mcGameState)
  {
    case GameState.Playing:
      drawPlayingStateUI();
      break;
    default:
      break;
  }

}

/*------------------------------------------ DRAW UI PRIVATE METHODS ------------------------------------------*/
private function drawPlayingStateUI()
{
  // HEALTH BAR
  if (mcFullHealthBar && mcEmptyBar)
  {
    GUI.BeginGroup(Rect(mcHealthBarPos.x, mcHealthBarPos.y, mcBarSize.x, mcBarSize.y));
      GUI.Box(Rect(0,0, mcBarSize.x, mcBarSize.y), mcEmptyBar);
      GUI.BeginGroup(Rect(1, 1, mcBarSize.x * mcHealthSize, mcBarSize.y));
        GUI.Box(Rect(0, 0, mcBarSize.x, mcBarSize.y), mcFullHealthBar);
      GUI.EndGroup();
      GUI.Label(Rect( mcBarSize.x / 4, 0, mcBarSize.x, mcBarSize.y), mcPlayerStats.Health.ToString());
    GUI.EndGroup();
  }

  // MANA BAR
  if (mcFullManaBar && mcEmptyBar)
  {
    GUI.BeginGroup(Rect(mcManaBarPos.x, mcManaBarPos.y, mcBarSize.x, mcBarSize.y));
      GUI.Box(Rect(0,0, mcBarSize.x, mcBarSize.y), mcEmptyBar);
      GUI.BeginGroup(Rect(1, 1, mcBarSize.x * mcManaSize, mcBarSize.y));
        GUI.Box(Rect(0, 0, mcBarSize.x, mcBarSize.y), mcFullManaBar);
      GUI.EndGroup();
      GUI.Label(Rect(mcBarSize.x / 4, 0, mcBarSize.x, mcBarSize.y), mcPlayerStats.Mana.ToString());
    GUI.EndGroup();
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

} // InGameUI class

@script AddComponentMenu ("UI/In-Game UI")
