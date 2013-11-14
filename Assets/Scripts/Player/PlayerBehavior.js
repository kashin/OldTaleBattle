﻿
public class PlayerBehavior extends BasicDynamicGameObject
{
/*------------------------------------------ MAGIC ATTACK ------------------------------------------*/
public var mcProjectileFiresUpper: float = 3.0f;
public var mcHandleAttacksInput: boolean = true;
public var mcIgnorePlatformInputController: boolean = false; // true if do not want to change PlatformInputController's enabled state.



/*------------------------------------------ MELEE ATTACK ------------------------------------------*/
public var mcMeleeAttackRange: float = 10.0f;
public var mcMeleeAttackArcAngle: float = 0.3f;
public var mcMeleeAttackSpeed: float = 2.0f;
private var mcIsMeleeAttackInProgress: boolean = false;




/*------------------------------------------ MANA REGENERATION ------------------------------------------*/
public var mcManaRegenerationCycleTime: float = 10.0f;




/*------------------------------------------ ANIMATIONS NAMES ------------------------------------------*/
public var mcAttackAnimation = "Attack";
public var mcIdleAnimation = "Idle";
public var mcMoveAnimation = "Run";
public var mcDeathAnimation = "Death";




/*------------------------------------------ PRIVATE SECTION ------------------------------------------*/
private var mcPlayerStats: PlayerStats;

private var mcRegenerateMana = true;




/*------------------------------------------ METHODS SECTION ------------------------------------------*/

/*------------------------------------------ MONOBEHAVIOR IMPLEMENTATION ------------------------------------------*/
function Awake()
{
  super.Awake();
  mcPlayerStats = gameObject.GetComponent(PlayerStats);
}

function Start()
{
  super.Start();
  animation[mcAttackAnimation].speed *= mcMeleeAttackSpeed;
}

function Update()
{
  if (mcGameLogicStoped)
  {
    return;
  }
  if (mcHandleAttacksInput && Input.GetButtonDown("Magic Attack"))
  {
    mcPlayerStats.useMagicAttack(transform.position + transform.up * mcProjectileFiresUpper, transform.rotation);
  }
  if (mcHandleAttacksInput && !mcIsMeleeAttackInProgress && Input.GetButtonDown("Melee Attack"))
  {
    mcIsMeleeAttackInProgress = true;
    Invoke("checkApplyDamage", animation[mcAttackAnimation].length / (mcMeleeAttackSpeed * 2.0f));
    Invoke("updateMeleeAttackState", animation[mcAttackAnimation].length / mcMeleeAttackSpeed);
  }
  updateManaRegenerationCycle();
  updateAnimation();
}



/*------------------------------------------ COMPONENT METHODS ------------------------------------------*/
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

public function applyScore(score: int)
{
  mcPlayerStats.applyScore(score);
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

protected function onGameLogicStopedChanged(stoped: boolean)
{
  super.onGameLogicStopedChanged(stoped);
  var platformInputController = GetComponent(PlatformInputController);
  if (!mcIgnorePlatformInputController && platformInputController != null)
  {
    platformInputController.enabled = !mcGameLogicStoped;
  }
}

} // PlayerBehavior

@script RequireComponent (Animation)
@script RequireComponent (PlayerStats)

@script AddComponentMenu ("Player/Player Behavior")
