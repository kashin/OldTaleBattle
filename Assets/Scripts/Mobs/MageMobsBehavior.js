#pragma strict
class MageMobsBehavior extends MobsBehaviorComponent
{
  /// Holds a prefab of a Mage's projectile.
  public var mcAttackProjectile: GameObject;
  public var mcProjectileAppearsUpper: float = 3.0f;

  private var mcNextAttackTime: float = 0.0f;

  /// @see MobsBehaviorComponent.updateDamageToPlayer()
  protected function updateDamageToPlayer()
  {
    // so, let's check whether we can fire our projectile or not.
    if (!mcMinimalDistanceIsNotReached && mcMobsStats.Health > 0)
    {
      if ( (mcNextAttackTime == 0.0f || mcNextAttackTime <= Time.time) && !mcIsRechargingAttack)
      {
        mcIsRechargingAttack = true;
        Invoke("shootProjectile", animation[mcAttackAnimationName].length / 2.0f);
        mcNextAttackTime = Time.time + animation[mcAttackAnimationName].length;
      }
    }
    else
    {
        mcIsRechargingAttack = false;
    }
  }

  protected function shootProjectile()
  {
    if (mcMobsStats.Health > 0)
    {
      var projectile = Instantiate(mcAttackProjectile, transform.position + transform.up * mcProjectileAppearsUpper, transform.rotation);
      var projectileBehavior = projectile.GetComponent(ProjectileBehavior);
      projectileBehavior.mcCollideWithPlayer = true;
      projectileBehavior.mcCollideWithEnemy = false;
      projectileBehavior.mcSpeed = 0.5f;
      CancelInvoke();
      mcIsRechargingAttack = false;
    }
  }
}

@script RequireComponent (Animation)
@script RequireComponent (CharacterMotor)
@script RequireComponent (MobsStats)
@script AddComponentMenu ("Mobs/Mage Mobs Behavior")
