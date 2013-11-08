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

/*------------------------------------------ STATS ------------------------------------------*/


/*------------------------------------------ MOBS DAMAGE ------------------------------------------*/
/// Contains mob's damage.
var mcDamage: int = 10;
var mcDamageType: DamageType = DamageType.Physical;

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
