
public class ProjectileBehavior extends BasicDynamicGameObject
{

public var mcSpeed: float = 0.5f;
public var mcLifeTime: float = 0.2f;
public var mcCollideWithPlayer: boolean = false;
public var mcCollideWithEnemy: boolean = true;
public var destroyAfterCollision: boolean = true;

// projectile's name
var mcName = "";
public function get Name(): String
{
  return mcName;
}

// projectile's description
var mcDescription = "";
public function get Description(): String
{
  return mcDescription;
}


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
  if (colliderIsPlayer(other))
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
  else if ( colliderIsEnemy(other) )
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
  else if (colliderIsBonus(other)) // do not destroy object if collided with bonus.
  {
    collisionHandled = false;
  }
  else if (!colliderIsMagicAttack(other))
  {
    collisionHandled = true;
  }
  if (collisionHandled && destroyAfterCollision)
  {
    Destroy(gameObject, mcLifeTime);
  }
}

/*------------------------------------------ CUSTOM METHODS ------------------------------------------*/
  protected function colliderIsPlayer(other : Collider): boolean
  {
    var result = false;
    if ( other.CompareTag("Player") || (other.transform.parent && other.transform.parent.CompareTag("Player")) ) // parent is a hack for Character Controller workaround.
    {
      result = true;
    }
    return result;
  }

  protected function colliderIsEnemy(other : Collider): boolean
  {
    var result = false;
    if ( other.CompareTag("Enemy") || (other.transform.parent && other.transform.parent.CompareTag("Enemy")) ) // parent is a hack for Character Controller workaround.
    {
      result = true;
    }
    return result;
  }

  protected function colliderIsBonus(other : Collider): boolean
  {
    var result = false;
    if ( other.CompareTag("Bonus") )
    {
      result = true;
    }
    return result;
  }


  protected function colliderIsMagicAttack(other : Collider): boolean
  {
    var result = false;
    if ( other.CompareTag("MagicAttack") || (other.transform.parent && other.transform.parent.CompareTag("MagicAttack")) ) // parent is a hack for Character Controller workaround.
    {
      result = true;
    }
    return result;
  }

} // ProjectileBehavior