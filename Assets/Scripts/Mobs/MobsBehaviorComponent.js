#pragma strict

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

/// Player's components.
private var mcPlayerBehavior: PlayerBehavior;
private var mcPlayerTransform: Transform;


// holds current animtion name.
private var mcCurrentAnimationName = "Idle";

private var mcMotor: CharacterMotor;
private var mcSqrDetectPlayerOnDistance: float;
private var mcSqrMinimalDistanceToPlayer: float;
private var mcSqrDistanceBetweenPlayerAndMob: float = 0.0f;

/// @brief @c true if we are not too close to a player to keep walking and @c false otherwise
private var mcMinimalDistanceIsNotReached: boolean = true;

private var mcPlayerWithinVisibleDistance: boolean = false;

/// MobsStats component.
private var mcMobsStats: MobsStats;

function Awake()
{
    mcMotor = GetComponent(CharacterMotor);
    mcMobsStats = GetComponent(MobsStats);
    mcSqrDetectPlayerOnDistance = mcDetectPlayerOnDistance * mcDetectPlayerOnDistance;
    mcSqrMinimalDistanceToPlayer  = mcMinimalDistanceToPlayer * mcMinimalDistanceToPlayer;
}

function Start ()
{
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

function Update ()
{
  // Check whether we can 'see' Player or not.
  var vectorBetweenObjects = mcPlayerTransform.position - transform.position;
  mcSqrDistanceBetweenPlayerAndMob = vectorBetweenObjects.sqrMagnitude;
  updatePlayerWithinVisibleDistance();
  updateMinimalDistanceToPlayerReached();
  updateAnimation();
  updateDamageToPlayer();

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
    var playerPos = mcPlayerTransform.position;
    playerPos.y = transform.position.y;
    var rotationAdditionalVelocity = mcSqrDistanceBetweenPlayerAndMob / mcSqrDetectPlayerOnDistance;
    var newRotation = Quaternion.Lerp(transform.rotation, Quaternion.LookRotation(playerPos - transform.position), mcRotationSpeed * Time.deltaTime / rotationAdditionalVelocity);
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
  // it is time to attack our Player.
  var damage = mcMobsStats.getAttackDamage();
  mcPlayerBehavior.applyDamage(damage);
  CancelInvoke();
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
  else if (!mcMinimalDistanceIsNotReached)
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

private function updateDamageToPlayer()
{
  if (animation.IsPlaying(mcAttackAnimationName)) // ok, we are playing an attack animation, it is time to 'hit' a player.
  {
    Invoke("applyDamageToPlayer", animation[mcAttackAnimationName].length);
  }
}

function applyDamage(damage: Damage)
{
  mcMobsStats.applyDamage(damage);
}

@script RequireComponent (Animation)
@script RequireComponent (CharacterMotor)
@script RequireComponent (MobsStats)
@script AddComponentMenu ("Mobs/Mobs Behavior")
