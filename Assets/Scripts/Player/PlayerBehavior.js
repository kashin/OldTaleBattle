#pragma strict

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

public var mcManaRegenerationCycleTime: float = 10.0f;

public var mcAttackAnimation = "Attack";
public var mcIdleAnimation = "Idle";
public var mcMoveAnimation = "Run";
public var mcDeathAnimation = "Death";

/*--- PRIVATE SECTION---*/
private var mcPlayerStats: PlayerStats;
private var mcProjectileBehavior: ProjectileBehavior;

private var mcRegenerateMana = true;


/*--- METHODS SECTION---*/
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
  updateManaRegenerationCycle();
  updateAnimation();
}

private function updateAnimation()
{
  if (mcPlayerStats.Health == 0)
  {
    if (!animation.IsPlaying(mcDeathAnimation))
    {
      animation.CrossFade(mcDeathAnimation);
    }
    return;
  }
  if (!animation.IsPlaying(mcMoveAnimation))
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

@script RequireComponent (Animation)
@script RequireComponent (PlayerStats)

@script AddComponentMenu ("Player/Player Behavior")
