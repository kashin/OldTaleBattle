public class HealthBonus extends BasicBonus
{
/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcHealPoints: int = 20;
public var mcColorStart: Color;
public var mcColorEnd: Color;

/// Duration of a change from mcColorStart to mcColorEnd
public var mcBlinkDuration: float = 0.5f;

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
private var mcChangeColorToColorEnd: boolean  = true;
private var mcNextColorDirectionChangeTime: float = 0.0f;
private var mcMaterial: Material;

/*------------------------------------------ MONOBEHAVIOR ------------------------------------------*/
function OnDestroy ()
{
  super.OnDestroy();
  DestroyImmediate(mcMaterial);
}
function Start()
{
  super.Start();
  mcMaterial = renderer.material;
}

function Update()
{
  super.Update();
  var t: float =  Mathf.PingPong(Time.time, mcBlinkDuration) / mcBlinkDuration;
  mcMaterial.SetColor("_TintColor", Color.Lerp(mcColorStart, mcColorEnd, t));
}

function OnTriggerEnter(other : Collider)
{
  if (other.CompareTag("Player") || (other.transform.parent && other.transform.parent.CompareTag("Player")) ) // parent is a hack for Character Controller workaround.
  {
    // ok, let's heal Player now.
    if (mcPlayer)
    {
      mcPlayer.applyHealing(mcHealPoints);
    }
    super.OnTriggerEnter(other);
  }
}

} // HealthBonus

@script AddComponentMenu ("Bonuses/Health Bonus")