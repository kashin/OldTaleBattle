public class MagicAttackTouchControl extends BaseTouchScreenControl
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcPlayer: PlayerBehavior;



/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/

// position of a control
private var mcControlPosition: Vector2 = Vector2(0, 0);

private var mcSpaceSize: int = 40;




/*------------------------------------------ MONOBEHAVIOR IMPLEMENTATION ------------------------------------------*/
function Start ()
{
  super.Start();
  if (!mcPlayer)
  {
    var playerObject = GameObject.FindGameObjectWithTag("Player");
    if (playerObject)
    {
      mcPlayer = playerObject.GetComponent(PlayerBehavior);
    }
  }
  mcControlPosition.x = Screen.width - 3 * mcSpaceSize - 2 * mcControlSize.x;
  mcControlPosition.y = mcSpaceSize;
  guiTexture.pixelInset = Rect(mcControlPosition.x, mcControlPosition.y, mcControlSize.x, mcControlSize.y);
}

function Update ()
{
  if (!mcScreenControlEnabled || (mcGameState != GameState.Playing && mcGameState != GameState.Tutorial))
  {
    //do nothing if screen controls are disabled or if we are not in a Playing game state
    return;
  }
  super.Update();
}



/*------------------------------------------ PROTECTED METHODS ------------------------------------------*/
protected function handleTouchBegan(touch: Touch)
{
  if (mcPlayer)
  {
    mcPlayer.performMagicAttack();
  }
}

}

@script AddComponentMenu ("UI/Touch Screen Magic Attack UI")