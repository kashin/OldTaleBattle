#pragma strict

/*--- MAGIC PROJECTILE ---*/
var mcMagicAttackProjectile: GameObject;
public function set MagicAttackProjectile(value: GameObject)
{
  mcMagicAttackProjectile = value;
  if (mcMagicAttackProjectile)
  {
    mcProjectileBehavior = mcMagicAttackProjectile.GetComponent(ProjectileBehavior);
  }
}
public function get MagicAttackProjectile(): GameObject
{
  return mcMagicAttackProjectile;
}

public var mcProjectileFiresUpper: float = 3.0f;



/*--- MELEE ATTACK ---*/
public var mcMeleeAttackRange: float = 10.0f;
public var mcMeleeAttackArcAngle: float = 0.3f;
private var mcIsMeleeAttackInProgress: boolean = false;




/*--- MANA REGENERATION ---*/
public var mcManaRegenerationCycleTime: float = 10.0f;




/*--- ANIMATIONS NAMES ---*/
public var mcAttackAnimation = "Attack";
public var mcIdleAnimation = "Idle";
public var mcMoveAnimation = "Run";
public var mcDeathAnimation = "Death";




/*--- PRIVATE SECTION---*/
private var mcPlayerStats: PlayerStats;
private var mcProjectileBehavior: ProjectileBehavior;

private var mcRegenerateMana = true;




/*--- METHODS SECTION---*/

/*--- MONOBEHAVIOR IMPLEMENTATION---*/
function Awake()
{
  mcPlayerStats = gameObject.GetComponent(PlayerStats);
}

function Start()
{
  if (mcMagicAttackProjectile)
  {
    mcProjectileBehavior = mcMagicAttackProjectile.GetComponent(ProjectileBehavior);
  }
}

function Update()
{
  if (Input.GetButtonDown("Magic Attack"))
  {
    if (mcProjectileBehavior)
    {
      if (mcProjectileBehavior.ManaCost <= mcPlayerStats.Mana)
      {
        mcPlayerStats.applyManaChange(-mcProjectileBehavior.ManaCost);
        Instantiate(mcMagicAttackProjectile, transform.position + transform.up * mcProjectileFiresUpper, transform.rotation);
      }
    }
  }
  if (!mcIsMeleeAttackInProgress && Input.GetButtonDown("Melee Attack"))
  {
    mcIsMeleeAttackInProgress = true;
    Invoke("checkApplyDamage", animation[mcAttackAnimation].length / 2.0f);
    Invoke("updateMeleeAttackState", animation[mcAttackAnimation].length);
  }
  updateManaRegenerationCycle();
  updateAnimation();
}



/*--- COMPONENT METHODS ---*/
private function updateAnimation()
{
  if (mcPlayerStats.Health == 0)
  {
    if (!animation.IsPlaying(mcDeathAnimation))
    {
      animation.CrossFade(mcDeathAnimation);
    }
  }
  else if (mcIsMeleeAttackInProgress)
  {
    if (!animation.IsPlaying(mcAttackAnimation))
    {
      animation.CrossFade(mcAttackAnimation);
    }
  }
  else if (!animation.IsPlaying(mcMoveAnimation)) // TODO: play Idle animation by default and play Move animation only when we are moving.
  {
    animation.CrossFade(mcMoveAnimation);
  }
}

public function applyDamage(damage: Damage)
{
  mcPlayerStats.applyDamage(damage);
}

private function updateManaRegenerationCycle()
{
  if (mcRegenerateMana)
  {
    Invoke("regenerateMana", mcManaRegenerationCycleTime);
    mcRegenerateMana = false;
  }
}

private function regenerateMana()
{
  mcPlayerStats.doManaRegeneration();
  mcRegenerateMana = true;
}

private function updateMeleeAttackState()
{
  mcIsMeleeAttackInProgress = false;
}

private function checkApplyDamage()
{
  var rayCastHit: RaycastHit;
  var position = transform.position + transform.up * mcProjectileFiresUpper;
  var attackAngle = -mcMeleeAttackArcAngle;
  var rayCastStep = mcMeleeAttackArcAngle / 2.0f;
  // hardcoded for now, but I don't see much point in raycasting a lot of times here, because
  // we might hit mulitple targets.
  for (var i = 0; i < 5; i++)
  {
    var direction = (transform.right * attackAngle) + transform.forward;
    attackAngle += rayCastStep;
    if(Physics.Raycast(position, direction, rayCastHit, mcMeleeAttackRange))
    {
      // ok, we just hit something.
      if (rayCastHit.collider.CompareTag("Enemy"))
      {
        var behaviorComponent = rayCastHit.collider.gameObject.GetComponent(MobsBehaviorComponent);
        behaviorComponent.applyDamage(mcPlayerStats.getMeleeDamage());
        break;
      }
      else if (rayCastHit.collider.transform.parent && rayCastHit.collider.transform.parent.CompareTag("Enemy")) // hack for Character Controller workaround.
      {
        behaviorComponent = rayCastHit.collider.transform.parent.GetComponent(MobsBehaviorComponent);
        if (behaviorComponent)
        {
          behaviorComponent.applyDamage(mcPlayerStats.getMeleeDamage());
        }
        break;
      }
    }
  }
}

@script RequireComponent (Animation)
@script RequireComponent (PlayerStats)

@script AddComponentMenu ("Player/Player Behavior")
