#pragma strict

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcModelsTranforms: Transform[];

// Since all our models have different sizes it is better to have a different
public var mcCamerasDistancesToModels: float[];

public var mcMoveTime: float = 1.0f;

/*------------------------------------------ STYLES ------------------------------------------*/
public var mcLeftArrowStyle: GUIStyle;
public var mcRightArrowStyle: GUIStyle;

/*------------------------------------------ SIZES ------------------------------------------*/
public var mcArrowsSize: Vector2 = Vector2(50, 50);

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mcScreenWidth: float = 0.0f;
private var mcScreenHeight: float = 0.0f;
private var mcSpaceToButton: float = 30.0f;
private var mcArrowsPos: Vector2 = Vector2(0, 0);

private var mcModelIndex: int = 0;
private var mcMoveToPosition: Vector3 = Vector3(0, 0, 0);

/*------------------------------------------ MONOBEHAVIOR ------------------------------------------*/
function Start()
{
  mcScreenWidth = Screen.width;
  mcScreenHeight = Screen.height;
  mcArrowsPos.x = mcScreenWidth - mcSpaceToButton - mcArrowsSize.x;
  mcArrowsPos.y = mcScreenHeight - mcSpaceToButton - mcArrowsSize.y;
  setModelIndex(0);
  mcMoveToPosition.y = transform.position.y;
}

function Update()
{
  var currentPosition = transform.position;
  transform.position = Vector3.Lerp(currentPosition, mcMoveToPosition, mcMoveTime);
  mcMoveTime *= 0.1 * Time.deltaTime;
}

function OnGUI()
{
  GUI.BeginGroup(Rect(0, 0, mcScreenWidth, mcScreenHeight));
    // Left Arrow Button
    if (mcModelIndex > 0 && GUI.Button(Rect(mcSpaceToButton, mcArrowsPos.y, mcArrowsSize.x, mcArrowsSize.y), "", mcLeftArrowStyle))
    {
      setModelIndex(mcModelIndex - 1);
    }
    // Right Arrow Button
    if (mcModelIndex < mcModelsTranforms.Length - 1 && GUI.Button(Rect(mcArrowsPos.x, mcArrowsPos.y, mcArrowsSize.x, mcArrowsSize.y), "", mcRightArrowStyle))
    {
      setModelIndex(mcModelIndex + 1);
    }
  GUI.EndGroup();
}

private function setModelIndex(index: int)
{
  if ( index < mcModelsTranforms.Length  && index >= 0)
  {
    var modelPos = mcModelsTranforms[index].position;
    mcMoveToPosition.x = modelPos.x;
    if (index < mcCamerasDistancesToModels.Length)
    {
      mcMoveToPosition.z = modelPos.z - mcCamerasDistancesToModels[index];
    }
    mcMoveTime = 1.0f;
    mcModelIndex = index;
  }
}

@script AddComponentMenu ("UI/Bestiary Control")
