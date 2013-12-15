public class ManaBonus extends BasicBonus
{
/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
public var mcManaPoints: int = 20;

/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/

/*------------------------------------------ MONOBEHAVIOR ------------------------------------------*/
function OnTriggerEnter(other : Collider)
{
  if (other.CompareTag("Player") || (other.transform.parent && other.transform.parent.CompareTag("Player")) ) // parent is a hack for Character Controller workaround.
  {
    // ok, let's heal Player now.
    if (mcPlayer)
    {
      mcPlayer.applyManaChange(mcManaPoints);
    }
    super.OnTriggerEnter(other);
  }
}

} // HealthBonus

@script AddComponentMenu ("Bonuses/Mana Bonus")