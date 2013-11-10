
public class GameMusic extends MonoBehaviour implements ApplicationSettingsListener, GameEventsListener
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcLooped: boolean = false;
public var mcAudioSource: AudioSource;
public var mcInGameAudioClips: AudioClip[];
public var mcMenuGameAudioClips: AudioClip[];

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mcCurrentInGameClip: AudioClip;
private var mcCurrentMenuClip: AudioClip;

private var mcMainMenuComponent: MainMenu;
private var mcGameDirector: GameDirector;

private var mcGameState: GameState = GameState.MainMenuShown;
private var mcSoundEnabled: boolean = true;

/*------------------------------------------ MONOBEHAVIOR METHODS ------------------------------------------*/
function OnDestroy()
{
  if (mcMainMenuComponent)
  {
    mcMainMenuComponent.removeApplicationSettingsListener(this);
  }
  if (mcGameDirector)
  {
    mcGameDirector.removeGameEventsListener(this);
  }
}

function Start()
{
  if (mcAudioSource == null)
  {
    mcAudioSource = audio;
  }

  regenerateRandomInGameClip();
  regenerateRandomMenuClip();
  playMenuClip();
  var mainMenuObject = GameObject.FindGameObjectWithTag("MainMenu");
  if (mainMenuObject)
  {
    mcMainMenuComponent = mainMenuObject.GetComponent(MainMenu);
    if (mcMainMenuComponent)
    {
      mcMainMenuComponent.addApplicationSettingsListener(this);
    }
  }
  else
  {
    Debug.LogError("BasicDynamicGameObject.Start(): GameDirector's GameObject not found");
  }
  var gameDirectorObject = GameObject.FindGameObjectWithTag("GameDirector");
  if (gameDirectorObject)
  {
    mcGameDirector = gameDirectorObject.GetComponent(GameDirector);
    if (mcGameDirector)
    {
      mcGameDirector.addGameEventsListener(this);
    }
  }
}

/*------------------------------------------ CUSTOM METHODS ------------------------------------------*/
private function regenerateRandomInGameClip()
{
  var clipIndex: int;
  if (mcInGameAudioClips.Length > 0)
  {
    clipIndex = Random.Range(0, mcInGameAudioClips.Length);
    mcCurrentInGameClip = mcInGameAudioClips[clipIndex];
  }
}

private function regenerateRandomMenuClip()
{
  var clipIndex: int;
  if (mcMenuGameAudioClips.Length > 0)
  {
    clipIndex = Random.Range(0, mcMenuGameAudioClips.Length);
    mcCurrentMenuClip = mcMenuGameAudioClips[clipIndex];
  }
}

private function playInGameClip()
{
  if (mcSoundEnabled)
  {
    mcAudioSource.Stop();
    mcAudioSource.clip = mcCurrentInGameClip;
    mcAudioSource.loop = mcLooped;
    mcAudioSource.Play();
  }
}

private function playMenuClip()
{
  if (mcSoundEnabled)
  {
    mcAudioSource.Stop();
    mcAudioSource.clip = mcCurrentMenuClip;
    mcAudioSource.loop = mcLooped;
    mcAudioSource.Play();
  }
}

/*------------------------------------------ APPLICATION SETTINGS LISTENER INTERFACE ------------------------------------------*/
function onSoundEnabledChanged(enabled: boolean)
{
  if (mcAudioSource)
  {
    if (enabled)
    {
      mcAudioSource.Play();
    }
    else
    {
      mcAudioSource.Stop();
    }
  }
  mcSoundEnabled = enabled;
}

function onGameDifficultyChanged(gameDifficulty: GameDifficulty)
{}


/*------------------------------------------ APPLICATION SETTINGS LISTENER INTERFACE ------------------------------------------*/
function onGameStateChanged(gameState: GameState)
{
  switch(gameState)
  {
    case GameState.Playing:
      if (mcGameState == GameState.FullScreenUIOpened)
      {
        // do nothing if we are already playing an In-Game music.
        break;
      }
    case GameState.FullScreenUIOpened:
      if (mcGameState == GameState.Playing)
      {
        // do nothing if we are already playing an In-Game music.
        break;
      }
      regenerateRandomInGameClip();
      playInGameClip();
      break;
    case GameState.MainMenuShown:
      if (mcGameState == GameState.MainMenuShown)
      {
        // do nothing if we are already playing a Menu music.
        break;
      }
      regenerateRandomMenuClip();
      playMenuClip();
      break;
    case GameState.GameOver:
      // TODO: play game over music?
      break;
    default:
      break;
  }
  mcGameState = gameState;
}


}

@script RequireComponent (AudioSource)
@script AddComponentMenu ("GameSounds/In Game Music")
