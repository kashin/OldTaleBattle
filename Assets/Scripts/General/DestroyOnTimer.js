#pragma strict

public class DestroyOnTimer extends BasicDynamicGameObject
{

public var mcLifeTime: float = 15.0f;

private var mcDeathTime: float = 0.0f;

/*------------------------------------------ MONOBEHAVIOR METHODS ------------------------------------------*/
function Start()
{
    super.Start();
    mcDeathTime = Time.time + mcLifeTime;
}

function Update()
{
    if (mcGameLogicStoped) // do nothing if game logic is stoped
    {
      return;
    }
    if (Time.time >= mcDeathTime)
    {
      Destroy(gameObject);
    }
}

/*------------------------------------------ CUSTOM METHODS ------------------------------------------*/
protected function onGameLogicStopedChanged(stoped: boolean)
{
  super.onGameLogicStopedChanged(stoped);
  if (stoped)
  {
    if (mcDeathTime > 0.0f)
    {
      mcDeathTime = mcDeathTime - Time.time;
    }
  }
  else
  {
    if (mcDeathTime > 0.0f)
    {
      mcDeathTime = Time.time + mcDeathTime;
    }
  }
}

}