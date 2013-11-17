public class MeleeAttackTouchControl extends BaseTouchScreenControl
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcPlayer: PlayerBehavior;



/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/

// position of a move control
private var mcControlPosition: Vector2 = Vector2(0, 0);

private var mcSpaceSize: int = 30;




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
  mcControlPosition.x = Screen.width - mcSpaceSize - mcControlSize.x;
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
}

/*------------------------------------------ PROTECTED METHODS ------------------------------------------*/
protected function handleTouchBegan(touch: Touch)
{
  if (mcPlayer)
  {
    mcPlayer.performMeleeAttack();
  }
}


/*------------------------------------------ GAME EVENTS LISTENER ------------------------------------------*/
public function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
  guiTexture.enabled = gameState == GameState.Playing;
}

}

@script AddComponentMenu ("UI/Touch Screen Melee Attack UI")