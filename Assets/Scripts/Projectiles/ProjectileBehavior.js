
public class ProjectileBehavior extends BasicDynamicGameObject
{

public var mcSpeed: float = 0.5f;
public var mcLifeTime: float = 0.2f;
public var mcCollideWithPlayer: boolean = false;
public var mcCollideWithEnemy: boolean = true;

/*------------------------------------------ PROJECTILE'S STATS ------------------------------------------*/
var mcBasicAttackStats: BasicAttackStats;
public function get AttackStats(): BasicAttackStats
{
  return mcBasicAttackStats;
}
protected function set AttackStats(value: BasicAttackStats)
{
  mcBasicAttackStats = value;
}

/*------------------------------------------ MONOBEHAVIOR ------------------------------------------*/
function Update()
{
  if (!mcGameLogicStoped)
  {
    transform.position += transform.forward * mcSpeed;
  }
}

function OnTriggerEnter(other : Collider)
{
  var collisionHandled = false;
  if (other.CompareTag("Player") || (other.transform.parent && other.transform.parent.CompareTag("Player")) ) // parent is a hack for Character Controller workaround.
  {
    if (mcCollideWithPlayer)
    {
      var playersComponent: PlayerBehavior = other.gameObject.GetComponent(PlayerBehavior);
      if (playersComponent == null)
      {
        playersComponent = other.transform.parent.GetComponent(PlayerBehavior);
      }
      if (playersComponent != null && mcBasicAttackStats != null)
      {
        playersComponent.applyDamage(new Damage(mcBasicAttackStats.DamageType, mcBasicAttackStats.Damage));
      }
      collisionHandled = true;
    }
  }
  else if (other.CompareTag("Enemy") || (other.transform.parent && other.transform.parent.CompareTag("Enemy")) ) // parent is a hack for Character Controller workaround.
  {
    if (mcCollideWithEnemy)
    {
      var mobsComponent: MobsBehaviorComponent = other.gameObject.GetComponent(MobsBehaviorComponent);
      if (mobsComponent == null)
      {
        mobsComponent = other.transform.parent.GetComponent(MobsBehaviorComponent);
      }
      if (mobsComponent != null)
      {
        mobsComponent.applyDamage(new Damage(mcBasicAttackStats.DamageType, mcBasicAttackStats.Damage));
      }
      collisionHandled = true;
    }
  }
  else if (other.CompareTag("Bonus")) // do not destroy object if collided with bonus.
  {
    collisionHandled = false;
  }
  else if (!other.CompareTag("MagicAttack") || (other.transform.parent && !other.transform.parent.CompareTag("MagicAttack"))) // parent is a hack for Character Controller workaround.
  {
    collisionHandled = true;
  }
  if (collisionHandled)
  {
    Destroy(gameObject, mcLifeTime);
  }
}


} // ProjectileBehavior