#pragma strict

public var generalAPText = "AP";

private var selfText: GUIText;

// Action Points
var mActionPoints: int = 10;
public function get ActionPoints()
{
  return mActionPoints;
}
public function set ActionPoints(value: int)
{
  mActionPoints = value;
  updateText();
}

// Available Action Points
var mAvailableActionPoints: int = 10;
public function get AvailableActionPoints()
{
  return mAvailableActionPoints;
}
public function set AvailableActionPoints(value: int)
{
  mAvailableActionPoints = value;
  updateText();
}

/// Initialization
function Start()
{
  selfText = gameObject.guiText;
  updateText();
}

/// Update Action points text
private function updateText()
{
  if (selfText != null)
  {
    selfText.text = mAvailableActionPoints + "/" + mActionPoints + " " + generalAPText;
  }
}

@script AddComponentMenu ("UI/Action points text")