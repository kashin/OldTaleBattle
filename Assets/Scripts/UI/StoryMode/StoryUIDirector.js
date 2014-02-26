#pragma strict

public class StoryUIDirector extends BasicUIComponent
{
	public var availableSpellsActions: GUITexture[];
	public var availableMeleeActions: GUITexture[];

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