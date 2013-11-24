
public class ProjectileBehavior extends BasicDynamicGameObject
{

public var mcSpeed: float = 0.5f;
public var mcLifeTime: float = 0.2f;
public var mcCollideWithPlayer: boolean = false;
public var mcCollideWithEnemy: boolean = true;
var mcManaCost: float = 10.0f;
public function get ManaCost(): int
{
  return mcManaCost;
}

/*------------------------------------------ PROJECTILE'S DAMAGE STATS ------------------------------------------*/
var mcDamage: int = 10;
var mcBaseDamage: int = 10;
var mcDamageType: DamageType = DamageType.Fire;

var mcCharactersWillPower: int = 10;
public function set CharactersWillPower(value: int)
{
  if (value < 0)
  {
    value = 0;
  }
  mcCharactersWillPower = value;
  // Change damage according to an assigned Character's Will Power.
  mcDamage = mcBaseCharactersWillPower + (mcCharactersWillPower - mcBaseCharactersWillPower) * 2;
}
public function get CharactersWillPower(): int
{
  return mcCharactersWillPower;
}
private var mcBaseCharactersWillPower: int = 10;

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
  var foundInParent = false;
  if (other.CompareTag("Player") || (other.transform.parent && other.transform.parent.CompareTag("Player")) ) // parent is a hack for Character Controller workaround.
  {
    if (mcCollideWithPlayer)
    {
      var playersComponent: PlayerBehavior = other.gameObject.GetComponent(PlayerBehavior);
      if (playersComponent == null)
      {
        playersComponent = other.transform.parent.GetComponent(PlayerBehavior);
      }
      if (playersComponent != null)
      {
        playersComponent.applyDamage(new Damage(mcDamageType, mcDamage));
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
        mobsComponent.applyDamage(new Damage(mcDamageType, mcDamage));
      }
      collisionHandled = true;
    }
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