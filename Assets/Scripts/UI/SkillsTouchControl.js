public class SkillsTouchControl extends BaseTouchScreenControl
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcInGameUI: InGameUI;
public var mcPlayerStats: PlayerStats;

/*------------------------------------------ TEXTURES ------------------------------------------*/
public var mcSkillPointsAvailableControlTexture: Texture2D;


/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/

// position of a move control
private var mcControlPosition: Vector2 = Vector2(0, 0);

private var mcSpaceSize: int = 30;




/*------------------------------------------ MONOBEHAVIOR IMPLEMENTATION ------------------------------------------*/
function Start ()
{
  super.Start();
  if (!mcInGameUI)
  {
    var inGameUIObject = GameObject.FindGameObjectWithTag("InGameUI");
    if (inGameUIObject)
    {
      mcInGameUI = inGameUIObject.GetComponent(InGameUI);
    }
  }
  if (!mcPlayerStats)
  {
    var playerObject = GameObject.FindGameObjectWithTag("Player");
    if (playerObject)
    {
      mcPlayerStats = playerObject.GetComponent(PlayerStats);
    }
  }
  mcControlPosition.x = Screen.width / 2 - mcSpaceSize - mcControlSize.x / 2;
  mcControlPosition.y = mcSpaceSize;
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
  var hasAvailableSkillPoints = mcPlayerStats.AvailableSkillPoints > 0;

  if (hasAvailableSkillPoints)
  {
    guiTexture.texture = mcSkillPointsAvailableControlTexture;
  }
  else
  {
    guiTexture.texture = mcControlTexture;
  }
}

/*------------------------------------------ PROTECTED METHODS ------------------------------------------*/
protected function handleTouchBegan(touch: Touch)
{
  if (mcInGameUI)
  {
    mcInGameUI.changeSkillsScreenState();
  }
}

}

@script AddComponentMenu ("UI/Touch Screen Open Skills UI")