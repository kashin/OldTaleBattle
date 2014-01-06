import System.Collections.Generic;

public class AcidCloudBehavior extends BasicMagicAttackBehavior
{

/*------------------------------------------ PUBLIC MEMBERS ------------------------------------------*/
  /// timeout between hits for the same collider.
  public var mcHitTimeOut: float = 3.0f;


/*------------------------------------------ PRIVATE MEMBERS ------------------------------------------*/
  /// holds a collider <-> time left for a next hit map
  private var mcHittingPlayerColliders: Dictionary.<Collider, float> = new Dictionary.<Collider, float>();
  private var mcHittingEnemyColliders: Dictionary.<Collider, float> = new Dictionary.<Collider, float>();
  
  private var mcPreviousOnTriggerStayTime: float = 0.0f;
  
  private var mcDeathTime: float = 0.0f;
  
/*------------------------------------------ MONOBEHAVIOR METHODS ------------------------------------------*/
  function Start()
  {
    super.Start();
    mcDeathTime = Time.time + mcLifeTime;
  }

  function Update()
  {
    // acid cloud is a static spell, so we do not call super.Update() here.
    mcPreviousOnTriggerStayTime = Time.time;
    if (mcGameLogicStoped) // do nothing if game logic is stoped
    {
      return;
    }
    if (Time.time >= mcDeathTime)
    {
      Destroy(gameObject);
    }
  }

/*------------------------------------------ COLLIDER METHODS ------------------------------------------*/
  function OnTriggerEnter(other : Collider)
  {
    // do nothing here, everything is handled in OnTriggerStay
  }

  function OnTriggerStay(other : Collider)
  {
    if (mcGameLogicStoped) // do nothing if game logic is stoped
    {
      return;
    }
    if (colliderIsPlayer(other) && mcCollideWithPlayer)
    {
      if (mcHittingPlayerColliders.ContainsKey(other))
      {
        // if 'hit' timeout is over we should hit collider again.
        mcHittingPlayerColliders[other] -= (Time.time - mcPreviousOnTriggerStayTime);
        if (mcHittingPlayerColliders[other] <= 0.0f)
        {
          hitPlayerCollider(other);
          mcHittingPlayerColliders[other] = mcHitTimeOut;
        }
      }
      else
      {
        // save this collider in a map and 'hit' it.
        mcHittingPlayerColliders.Add(other, mcHitTimeOut);
        hitPlayerCollider(other);
      }
    }
    else if (colliderIsEnemy(other) && mcCollideWithEnemy)
    {
      if (mcHittingEnemyColliders.ContainsKey(other))
      {
        // if 'hit' timeout is over we should hit collider again.
        mcHittingEnemyColliders[other] -= (Time.time - mcPreviousOnTriggerStayTime);
        if (mcHittingEnemyColliders[other] <= 0.0f)
        {
          hitEnemyCollider(other);
          mcHittingEnemyColliders[other] = mcHitTimeOut;
        }
      }
      else
      {
        // save this collider in a map and 'hit' it.
        mcHittingEnemyColliders.Add(other, mcHitTimeOut);
        hitEnemyCollider(other);
      }
    }
  }

  function OnTriggerExit(other : Collider)
  {
    if (mcHittingPlayerColliders.ContainsKey(other))
    {
      mcHittingPlayerColliders.Remove(other);
    }
    if (mcHittingEnemyColliders.ContainsKey(other))
    {
      mcHittingEnemyColliders.Remove(other);
    }
  }

/*------------------------------------------ CUSTOM METHODS ------------------------------------------*/
  protected function onGameLogicStopedChanged(stoped: boolean)
  {
    super.onGameLogicStopedChanged(stoped);
    if (stoped)
    {
      if (mcDeathTime > 0.0f)
      {
        mcDeathTime = mcDeathTime - Time.time;
      }
    }
    else
    {
      if (mcDeathTime > 0.0f)
      {
        mcDeathTime = Time.time + mcDeathTime;
      }
    }
  }

  private function hitPlayerCollider(other: Collider)
  {
    var playersComponent: PlayerBehavior = other.gameObject.GetComponent(PlayerBehavior);
    if (playersComponent == null)
    {
      playersComponent = other.transform.parent.GetComponent(PlayerBehavior);
    }
    if (playersComponent != null && AttackStats != null)
    {
      playersComponent.applyDamage(new Damage(AttackStats.DamageType, AttackStats.Damage));
    }
  }

  private function hitEnemyCollider(other: Collider)
  {
    var mobsComponent: MobsBehaviorComponent = other.gameObject.GetComponent(MobsBehaviorComponent);
    if (mobsComponent == null)
    {
      mobsComponent = other.transform.parent.GetComponent(MobsBehaviorComponent);
    }
    if (mobsComponent != null)
    {
      mobsComponent.applyDamage(new Damage(AttackStats.DamageType, AttackStats.Damage));
    }
  }

}

@script AddComponentMenu ("Attacks/Acid Cloud Spell")