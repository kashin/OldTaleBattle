#pragma strict

public var mcSpeed: float = 0.5f;
public var mcLifeTime: float = 0.2f;
public var mcCollideWithPlayer: boolean = false;

/*--- PROJECTILE'S DAMAGE STATS---*/
var mcDamage: int = 10;
var mcBaseDamage: int = 10;
var mcDamageType: DamageType = DamageType.Fire;

function Update()
{
  transform.position += transform.forward * mcSpeed;
}

function OnTriggerEnter(other : Collider)
{
  var collisionHandled = false;
  if (other.gameObject.tag == "Player")
  {
    if (mcCollideWithPlayer)
    {
      var playersComponent: PlayerBehavior = other.gameObject.GetComponent(PlayerBehavior);
      if (playersComponent != null)
      {
        playersComponent.applyDamage(new Damage(mcDamageType, mcDamage));
      }
      collisionHandled = true;
    }
  }
  else if (other.gameObject.tag == "Enemy")
  {
    var mobsComponent: MobsBehaviorComponent = other.gameObject.GetComponent(MobsBehaviorComponent);
    if (mobsComponent != null)
    {
      mobsComponent.applyDamage(new Damage(mcDamageType, mcDamage));
    }
    collisionHandled = true;
  }
  else if (other.gameObject.tag != "MagicAttack")
  {
    collisionHandled = true;
  }
  if (collisionHandled)
  {
    Destroy(gameObject, mcLifeTime);
  }
}