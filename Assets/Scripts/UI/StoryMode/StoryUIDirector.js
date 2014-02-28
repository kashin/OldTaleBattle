#pragma strict

public class StoryUIDirector extends BasicUIComponent
{
/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
	public var availableSpellsActions: GUITexture[];
	public var availableMeleeActions: GUITexture[];
	public var playerStats: PlayerStats;

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
	/// holds all currently picked actions for a turn.
	private var turnActions = new List.<BaseStoryAction>();

	function Start()
	{
		super.Start();
	}

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
	public function actionPressed(action: BaseStoryAction)
	{
	}
}

@script AddComponentMenu ("UI/Story UI Director")