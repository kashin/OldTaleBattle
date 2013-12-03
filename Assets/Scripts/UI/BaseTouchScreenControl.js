public class BaseTouchScreenControl extends BasicUIComponent implements ApplicationSettingsListener
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcScreenControlEnabled: boolean = false;

public var mcMainMenuComponent: MainMenu;

// @c true if we want to handle OnMouseDown() callbacks and @c false otherwise.
public var mcHandleMouseButtonPressed: boolean = false;

/*------------------------------------------ TEXTURES ------------------------------------------*/
public var mcControlTexture: Texture2D;

/*------------------------------------------ SIZES ------------------------------------------*/
public var mcControlAutoSize: Vector2 = Vector2(0.15f, 0.15f); // percentage of a screen size.

public var mcControlSize: Vector2 = Vector2(100, 100);


/*------------------------------------------ MONOBEHAVIOR IMPLEMENTATION ------------------------------------------*/
function OnDestroy()
{
  super.OnDestroy();
  if (mcMainMenuComponent)
  {
    mcMainMenuComponent.removeApplicationSettingsListener(this);
  }
}
function Start ()
{
  super.Start();
  guiTexture.texture = mcControlTexture;
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

  mcControlSize.y = Screen.height * mcControlAutoSize.y;
  mcControlSize.x = mcControlSize.y; // TODO: fix this
}

function Update ()
{
  if ( !mcScreenControlEnabled || (mcGameState != GameState.Playing && mcGameState != GameState.Tutorial) )
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
      switch(touch.phase)
      {
        case TouchPhase.Began:
          handleTouchBegan(touch);
          break;
        case TouchPhase.Moved:
          handleTouchMoved(touch);
          break;
        case TouchPhase.Stationary:
          handleTouchStationary(touch);
          break;
        case TouchPhase.Ended:
          handleTouchEnded(touch);
          break;
        case TouchPhase.Canceled:
          handleTouchCanceled(touch);
          break;
        default:
          break;
      }
    }
  }
}

function OnMouseDown()
{
  if (mcHandleMouseButtonPressed)
  {
    handleOnMouseDown();
  }
}


/*------------------------------------------ PROTECTED METHODS ------------------------------------------*/
// Empty here, should be overriden by other classes
protected function handleTouchBegan(touch: Touch)
{}

protected function handleTouchMoved(touch: Touch)
{}

protected function handleTouchStationary(touch: Touch)
{}

protected function handleTouchEnded(touch: Touch)
{}

protected function handleTouchCanceled(touch: Touch)
{}

protected function handleOnMouseDown()
{}

/*------------------------------------------ GAME EVENTS LISTENER ------------------------------------------*/
public function onGameStateChanged(gameState: GameState)
{
  super.onGameStateChanged(gameState);
  guiTexture.enabled = (gameState == GameState.Playing || gameState == GameState.Tutorial) && mcScreenControlEnabled;
}



/*------------------------------------------ APPLICATION SETTINGS LISTENER ------------------------------------------*/
function onTouchControlsEnabledChanged(enabled: boolean)
{
  mcScreenControlEnabled = enabled;
  guiTexture.enabled = enabled;
}

function onSoundEnabledChanged(enabled: boolean)
{}

function onGameDifficultyChanged(gameDifficulty: GameDifficulty)
{}

}
