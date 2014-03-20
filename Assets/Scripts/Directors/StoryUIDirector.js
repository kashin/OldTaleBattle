#pragma strict

public class StoryUIDirector extends BasicUIComponent
{
/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
	public var availableSpellsActions: GameObject[];
	public var availableMeleeActions: GameObject[];
	public var playerStats: PlayerStats;

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
	private var selfTransform: Transform;
  /// holds all currently picked actions for a turn.
	private var turnActions: List.<BaseStoryAction> = new List.<BaseStoryAction>();
  private var availableActionsOnScreen: List.<GameObject> = new List.<GameObject>();
  private var availableTurnActionsOnScreen:  List.<GameObject> = new List.<GameObject>();

  private var availableActionPoints: int = 0;

  /// positions, etc.
  // TODO: fix hardcoded values
  private var leftAvailableActionsSpace: int = 50;
  private var spaceBetweenActions: int = 10;
  private var bottomTurnActionsSpace: int = 70;

  /// specifies an action's placement on a screen.
  enum ActionPlacement
  {
    AvailableAction = 0,      // on a 'main' panel where all available actions are shown
    TurnAction                // on a 'turn' panel where all peeked for a current turn actions are shown
  }

/*------------------------------------------ MONOBEHAVIOR METHODS ------------------------------------------*/
	function Start()
	{
    selfTransform = gameObject.transform;
		super.Start();
    if (playerStats != null)
    {
      availableActionPoints = playerStats.ActionPoints;
    }

    createBattleUI(); // TODO: remove it later when we have a 'start battle' callback.
    newTurnStarted(); // TODO: remove it later when we have a 'start battle' callback.
	}



/*------------------------------------------ CUSTOM METHODS ------------------------------------------*/

/*------------------------------------------ PUBLIC METHODS ------------------------------------------*/
	public function actionPressed(action: BaseStoryAction)
	{
      addTurnAction(action);
	}

/*------------------------------------------ PRIVATE METHODS ------------------------------------------*/
  private function createBattleUI()
  {
    // creating all available actions and placing them on screen.
    var position: int = 0;
    for (var i = 0; i < availableMeleeActions.Length; i++)
    {
      var action = Instantiate(availableMeleeActions[i], selfTransform.position, selfTransform.rotation);
      placeActionOnScreen(action, position, ActionPlacement.AvailableAction);
      var baseActionComponent = action.GetComponent(BaseStoryAction);
      if (baseActionComponent)
      {
        baseActionComponent.mStoryUIDirector = this;
      }
      position++;
    }
    for (i = 0; i < availableSpellsActions.Length; i++)
    {
      action = Instantiate(availableSpellsActions[i], selfTransform.position, selfTransform.rotation);
      placeActionOnScreen(action, position, ActionPlacement.AvailableAction);
      baseActionComponent = action.GetComponent(BaseStoryAction);
      if (baseActionComponent)
      {
        baseActionComponent.mStoryUIDirector = this;
      }
      position++;
    }
  }

  private function newTurnStarted()
  {
    if (playerStats != null)
    {
      availableActionPoints = playerStats.ActionPoints;
    }
    // destroy all 'turn' actions.
    var iterator = availableTurnActionsOnScreen.GetEnumerator();
    while (iterator.MoveNext())
    {
      Destroy(iterator.Current);
    }
    availableTurnActionsOnScreen.Clear();
    turnActions.Clear();
  }

  private function placeActionOnScreen(actionObject: GameObject, position: int, placement: ActionPlacement)
  {
    var actionGuiTexture: GUITexture = actionObject.guiTexture;
    if (actionGuiTexture != null)
    {
      switch(placement)
      {
        case ActionPlacement.AvailableAction:
          actionGuiTexture.pixelInset.x = spaceBetweenActions * (position + 1) +
           leftAvailableActionsSpace + actionObject.guiTexture.pixelInset.width * position;
          actionGuiTexture.pixelInset.y = 0;
          if (availableActionsOnScreen.IndexOf(actionObject) < 0)
          {
            availableActionsOnScreen.Add(actionObject);
          }
          break;

        case ActionPlacement.TurnAction:
          actionGuiTexture.pixelInset.x = spaceBetweenActions * (position + 1) +
           leftAvailableActionsSpace + actionObject.guiTexture.pixelInset.width * position;
          actionGuiTexture.pixelInset.y = bottomTurnActionsSpace;
          if (availableTurnActionsOnScreen.IndexOf(actionObject) < 0)
          {
            availableTurnActionsOnScreen.Add(actionObject);
          }
          break;

        default:
          Debug.LogWarning("StoryUIDirector::placeActionOnScreen: new ActionPlacement added but it is not handled.");
          break;
      }
    }
  }

  private function hasActionPointsForAction(action: BaseStoryAction): boolean
  {
    return availableActionPoints >= action.AttackStats.ActionPointsCost;
  }

  private function addTurnAction(action: BaseStoryAction)
  {
    if (hasActionPointsForAction(action))
    {
      turnActions.Add(action); // might be a duplicate, but that is ok.
      availableActionPoints -= action.AttackStats.ActionPointsCost;
      var actionObject = Instantiate(action.mTurnAction, selfTransform.position, selfTransform.rotation);
      placeActionOnScreen(actionObject, availableTurnActionsOnScreen.Count, ActionPlacement.TurnAction);
    }
  }
}


@script AddComponentMenu ("UI/Story UI Director")