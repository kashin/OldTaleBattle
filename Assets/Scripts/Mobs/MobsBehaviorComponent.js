public class MobsBehaviorComponent  extends BasicDynamicGameObject
{

/*------------------------------------------ PUBLIC SECTION ------------------------------------------*/
/// @brief holds a ref on a Player's GameObject.
public var mcPlayer: GameObject;

public var mcWalkAnimationName = "Walk";
public var mcIdleAnimationName = "Idle";
public var mcAttackAnimationName = "Attack";
public var mcDeathAnimationName = "Death";

/// @brief Mobs speed and distances values.
public var mcDetectPlayerOnDistance: float = 50.0f;
public var mcRotationSpeed: float = 1.5f;
public var mcMobsSpeed: float = 1.0f;
public var mcMobsAttackArc: float = 2.0f;
public var mcDeathDelay: float = 1.0f;

var mcMinimalDistanceToPlayer: float = 4.0f;
public function set MinimalDistanceToPlayer(value: float)
{
  mcMinimalDistanceToPlayer = value;
  mcSqrMinimalDistanceToPlayer = mcMinimalDistanceToPlayer * mcMinimalDistanceToPlayer;
}
public function get MinimalDistanceToPlayer(): float
{
  return mcMinimalDistanceToPlayer;
}

/*------------------------------------------ PROTECTED SECTION ------------------------------------------*/
/// Used to keep Mob in Idle state till it is possible to attack again.
protected var mcIsRechargingAttack: boolean = false; //TODO: do we need it?

/// @brief @c true if we are not too close to a player to keep walking and @c false otherwise
protected var mcMinimalDistanceIsNotReached: boolean = true;

/// MobsStats component.
protected var mcMobsStats: MobsStats;

/*------------------------------------------ PRIVATE SECTION ------------------------------------------*/
/// Player's components.
private var mcPlayerBehavior: PlayerBehavior;
private var mcPlayerTransform: Transform;

// holds current animtion name.
private var mcCurrentAnimationName = "Idle";

private var mcSqrDetectPlayerOnDistance: float;
private var mcSqrMinimalDistanceToPlayer: float;
private var mcSqrDistanceBetweenPlayerAndMob: float = 0.0f;

private var mcPlayerWithinVisibleDistance: boolean = false;
private var mcRotationThatLooksAtPlayer: Quaternion;

private var mcPosition: Vector3;
private var mcPlayerPosition: Vector3;


/*------------------------------------------ METHODS SECTION ------------------------------------------*/
function Awake()
{
  super.Awake();
  mcMobsStats = GetComponent(MobsStats);
  mcSqrDetectPlayerOnDistance = mcDetectPlayerOnDistance * mcDetectPlayerOnDistance;
  mcSqrMinimalDistanceToPlayer  = mcMinimalDistanceToPlayer * mcMinimalDistanceToPlayer;
}

function Start ()
{
  super.Start();
  if (mcPlayer == null)
  {
    mcPlayer = GameObject.FindGameObjectWithTag("Player");
  }
  if (mcPlayer)
  {
    mcPlayerTransform = mcPlayer.transform;
    mcPlayerBehavior = mcPlayer.GetComponent(PlayerBehavior);
  }
  else
  {
    Debug.LogError("MobsBehavior.Start(): Player's GameObject not found");
  }

  var vectorBetweenObjects = mcPlayerTransform.position - transform.position;
  mcSqrDistanceBetweenPlayerAndMob = vectorBetweenObjects.sqrMagnitude;
  updatePlayerWithinVisibleDistance();
  animation.wrapMode = WrapMode.Loop;
  animation.Play();
  animation[mcAttackAnimationName].wrapMode = WrapMode.Once;
}

function Update()
{
  if (mcGameLogicStoped)
  {
    return;
  }
  if (mcMobsStats.Health == 0)
  {
    playDeath();
    mcMotor.inputMoveDirection = Vector3.zero;
    return;
  }

  // Saving positions for this update() call.
  mcPlayerPosition = mcPlayerTransform.position;
  mcPosition = transform.position;

  var playerPos = mcPlayerPosition;
  playerPos.y = transform.position.y;
  mcRotationThatLooksAtPlayer = Quaternion.LookRotation(playerPos - mcPosition);

  // Check whether we can 'see' Player or not.
  var vectorBetweenObjects = mcPlayerPosition - mcPosition;
  mcSqrDistanceBetweenPlayerAndMob = vectorBetweenObjects.sqrMagnitude;
  updatePlayerWithinVisibleDistance();
  updateMinimalDistanceToPlayerReached();
  updateDamageToPlayer();
  updateAnimation();

  // It is a time to attack Player if we can see him/her.
  if (mcPlayerWithinVisibleDistance)
  {
    // walk closer to a Player if distance between mob and player is too big.
    var moveDirection: Vector3;
    if (mcMinimalDistanceIsNotReached)
    {
      moveDirection = transform.forward * mcMobsSpeed;
    }
    else
    {
      moveDirection = Vector3.zero;
    }
    mcMotor.inputMoveDirection = moveDirection;

    // Constantly rotating our mob so that it 'follows' Player's movement if we can see him/her.
    // We should rotate only in y direction to keep mob 'stable'.
    var rotationAdditionalVelocity = mcSqrDistanceBetweenPlayerAndMob / mcSqrDetectPlayerOnDistance;
    var newRotation = Quaternion.Lerp(transform.rotation, mcRotationThatLooksAtPlayer, mcRotationSpeed * Time.deltaTime / rotationAdditionalVelocity);
    transform.rotation = newRotation;
  }
  else
  {
    // Hmm, Player is diappeared, so our mob stops.
    mcMotor.inputMoveDirection = Vector3.zero;
  }
}


/// @brief sets new player visible within distance value and notifies turns service about it.
private function updatePlayerWithinVisibleDistance()
{
  var newValue = mcSqrDistanceBetweenPlayerAndMob < mcSqrDetectPlayerOnDistance;
  if (mcPlayerWithinVisibleDistance != newValue)
  {
    mcPlayerWithinVisibleDistance = newValue;
  }
}

/// @brief updates whether mob is close enough to a player to stop or not.
private function updateMinimalDistanceToPlayerReached()
{
  var notReached = mcSqrMinimalDistanceToPlayer < mcSqrDistanceBetweenPlayerAndMob;
  if (mcMinimalDistanceIsNotReached != notReached)
  {
    mcMinimalDistanceIsNotReached = notReached;
  }
}

function applyDamageToPlayer()
{
  if (mcMobsStats.Health > 0)
  {
    // it is time to attack our Player.
    var damage = mcMobsStats.getAttackDamage();
    mcPlayerBehavior.applyDamage(damage);
    if (mcMobsStats.Health != 0)
    {
      CancelInvoke();
    }
  }
}

/// @brief updates current animation according to a mob's state.
private function updateAnimation()
{
  if (mcPlayerWithinVisibleDistance && mcMinimalDistanceIsNotReached)
  {
    // ok, it is time to start walking to a player.
    if ( !animation.IsPlaying(mcWalkAnimationName))
    {
      animation.CrossFade(mcWalkAnimationName);
    }
  }
  else if (!mcMinimalDistanceIsNotReached && !mcIsRechargingAttack)
  {
    // ok, it is time to attack our player!
    if ( !animation.IsPlaying(mcAttackAnimationName))
    {
      animation.CrossFade(mcAttackAnimationName);
    }
  }
  else
  {
    // Moving mob into Idle State.
    if ( !animation.IsPlaying(mcIdleAnimationName) )
    {
      animation.CrossFade(mcIdleAnimationName);
    }
  }
}

protected function updateDamageToPlayer()
{
  if (!mcMinimalDistanceIsNotReached && mcMobsStats.Health > 0) // ok, it is time to 'hit' a player (as soon as attack animation is over).
  {
    var angle = Quaternion.Angle(transform.rotation, mcRotationThatLooksAtPlayer);
    if (angle <= mcMobsAttackArc)
    {
      Invoke("applyDamageToPlayer", animation[mcAttackAnimationName].length);
    }
  }
}

function applyDamage(damage: Damage)
{
  mcMobsStats.applyDamage(damage);
}

private function destroyMobObject()
{
  Destroy(gameObject);
}

function playDeath()
{
  if (!animation.IsPlaying(mcDeathAnimationName))
  {
    animation.CrossFade(mcDeathAnimationName);
    Invoke("destroyMobObject", animation[mcDeathAnimationName].length + mcDeathDelay);
    animation[mcDeathAnimationName].wrapMode = WrapMode.ClampForever;
    animation.wrapMode = WrapMode.ClampForever;
    mcPlayerBehavior.applyScore(mcMobsStats.getScoreValue());

    gameObject.GetComponent(CharacterMotor).enabled = false;
    gameObject.GetComponent(CharacterController).enabled = false;

    var colliders = gameObject.GetComponentsInChildren(Collider);
    for (var collider: Collider in colliders)
    {
      collider.enabled = false;
    }
  }
}

} // MobsBehaviorComponent

@script RequireComponent (Animation)
@script RequireComponent (CharacterMotor)
@script RequireComponent (MobsStats)
@script AddComponentMenu ("Mobs/Mobs Behavior")
