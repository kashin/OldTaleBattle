public class MagicAttackTouchControl extends BasicUIComponent
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcPlayer: PlayerBehavior;

public var mcScreenControlEnabled: boolean = false;

/*------------------------------------------ TEXTURES ------------------------------------------*/
public var mcControlTexture: Texture2D;

/*------------------------------------------ SIZES ------------------------------------------*/
public var mcControlSize: Vector2 = Vector2(50, 50);



/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/

// position of a move control
private var mcControlPosition: Vector2 = Vector2(0, 0);
private var mcControlsCenterGlobalPosition: Vector2 = Vector2(0, 0);

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
  mcControlPosition.x = Screen.width - 2 * mcSpaceSize - 2 * mcControlSize.x;
  mcControlPosition.y = mcSpaceSize;
  guiTexture.pixelInset = Rect(mcControlPosition.x, mcControlPosition.y, mcControlSize.x, mcControlSize.y);
  guiTexture.texture = mcControlTexture;
  mcControlsCenterGlobalPosition.x = mcControlPosition.x;
  mcControlsCenterGlobalPosition.y = mcControlPosition.y;
}

function Update ()
{
  if (!mcScreenControlEnabled || mcGameState != GameState.Playing)
  {
    //do nothing if screen controls are disabled or if we are not in a Playing game state
    return;
  }

  // Check whether user is pressed on this control or not.
  for (var i = 0; i < Input.touchCount; i++)
  {
    var touch = Input.GetTouch(i);
    var touchPosition = touch.position;
    if (guiTexture.HitTest(touchPosition))
    {
      if (touch.phase == TouchPhase.Began)
      {
        // ok, user pressed on a control, handling press now.
        if (mcPlayer)
        {
          mcPlayer.performMagicAttack();
        }
      }
    }
  }
}


/*------------------------------------------ GAME EVENTS LISTENER ------------------------------------------*/
public function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
  guiTexture.enabled = gameState == GameState.Playing;
}

}

@script AddComponentMenu ("UI/Touch Screen Magic Attack UI")