#pragma strict

/// This component contains Mob's stats like damage, health, etc.

/// This enum specifies Damage type.
enum DamageType
{
  Physical,
  Fire,
  Mental
}

/*------------------------------------------ DAMAGE CLASS ------------------------------------------*/
/// This class represents a damage that any character on a scene receives during attack.
public class Damage
{
  public function Damage(type: DamageType, damage: int)
  {
    mType = type;
    mDamage = damage;
  }

  /// Type of a damage can't be changed after initialization.
  var mType: DamageType;
  public function get Type(): DamageType
  {
    return mType;
  }

  /// Damage of an attack.
  var mDamage: int;
  public function get DamageValue(): int
  {
    return mDamage;
  }
}

/*------------------------------------------ MOBS DIFFICULTY LEVEL ------------------------------------------*/
var mcDifficulty: GameDifficulty = GameDifficulty.Normal;
public function get Difficulty(): GameDifficulty
{
  return mcDifficulty;
}
public function set Difficulty(value: GameDifficulty)
{
  if (value != mcDifficulty)
  {
    mcDifficulty = value;
    updateMobsStats();
  }
}

/*------------------------------------------ MOBS STRENGTH ------------------------------------------*/
var mcStrength: int = 10;
public function set Strength(value: int)
{
  if (value < 1)
  {
    value = 1;
  }
  mcStrength = value;
  updateMobsStats();
}
public function get Strength(): int
{
  return mcStrength;
}

public var mcBaseStrength: int = 10;



/*------------------------------------------ STATS ------------------------------------------*/
private function updateMobsStats()
{
  var difficulty: int = mcDifficulty;
  var maxValue: int = GameDifficulty.MaximumValue;
  var strengthInfluence = (Strength - mcBaseStrength) / mcBaseStrength;
  Health = (mcBaseHealth * (difficulty + 1) / 2) + mcBaseHealth * strengthInfluence;
  Score = mcBaseScore * (maxValue - difficulty) / 2 + mcBaseScore * strengthInfluence * 1.5; // bigger score == more fun? :)
  MobsDamage = mcBaseDamage * (difficulty + 1) / 2 + mcBaseDamage * strengthInfluence;
}

/*------------------------------------------ MOBS DAMAGE ------------------------------------------*/
/// Contains mob's damage.
public var mcDamage: int = 10;
public function get MobsDamage(): int
{
  return mcDamage;
}
private function set MobsDamage(value: int)
{
  if (value < 0)
  {
    value = 0;
  }
  mcDamage = value;
}
public var mcBaseDamage: int = 10;

var mcDamageType: DamageType = DamageType.Physical;
public function get DamageType(): DamageType
{
  return mcDamageType;
}

/*------------------------------------------ MOBS HEALTH ------------------------------------------*/
/// Contains current mob's health.
var mcHealth: int = 20;
public function get Health(): int
{
  return mcHealth;
}
private function set Health(value: int)
{
  if (value < 0)
  {
    value = 0;
  }
  mcHealth = value;
}
public var mcBaseHealth: int = 20;

/*------------------------------------------ MOBS SCORE ------------------------------------------*/
/// Contains current mob's health.
var mcScore: int = 20;
public function get Score(): int
{
  return mcScore;
}
private function set Score(value: int)
{
  if (value < 0)
  {
    value = 0;
  }
  mcScore = value;
}
public var mcBaseScore: int = 20;

/*------------------------------------------ CUSTOM METHODS ------------------------------------------*/
public function getAttackDamage(): Damage
{
  return new Damage(mcDamageType, mcDamage);
}

public function applyDamage(damage: Damage)
{
  Health -= damage.DamageValue;
}

public function getScoreValue(): int
{
  return Score;
}

@script AddComponentMenu ("Mobs/Mobs Stats")
