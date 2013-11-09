import System.Collections.Generic;

/// This component contains Player's stats and updates Player's speed/damage/etc according to this stats.
/*------------------------------------------ PLAYER STATS LISTENER INTERFACE ------------------------------------------*/
interface PlayerStatsListener
{
  /// callback that is caleed when Health is changed.
  function onHealthChanged(health: int);
  function onManaChanged(mana: int);
  function onLevelChanged(level: int);
  function onAvailableSkillPointsChanged(availablePoints: int);
}

private var mcStatsListeners = new List.<PlayerStatsListener>();




/*------------------------------------------  STATS  ------------------------------------------*/

/*------------------------------------------  STRENGTH  ------------------------------------------*/
/// Strength is a stat that increases Player's health and physical(Melee) damage.
var mcStrength: int = 10;
public function get Strength(): int
{
  return mcStrength;
}
private function set Strength(value: int)
{
  mcStrength = value;
  MaxHealth = mcBaseHealth + (mcBaseHealth * (mcStrength - mcBaseStrength) / mcBaseStrength);
  MeleeDamage = mcBaseMeleeDamage + (mcStrength - mcBaseStrength);
}
var mcBaseStrength: int = 10;

public function increaseStrength(increase: int)
{
  if (AvailableSkillPoints > 0)
  {
    Strength += increase;
  }
  useAvailableSkillPoints(increase);
}




/*------------------------------------------  INTELLIGENT  ------------------------------------------*/
/// Intelligent increases Player's Mana.
var mcIntelligent: int = 10;
public function get Intelligent(): int
{
  return mcIntelligent;
}
private function set Intelligent(value: int)
{
  mcIntelligent = value;
  MaxMana = mcBaseMana + (mcBaseMana * (mcIntelligent - mcBaseIntelligent) / mcBaseIntelligent);
}
var mcBaseIntelligent: int = 10;

public function increaseIntelligent(increase: int)
{
  if (AvailableSkillPoints > 0)
  {
    Intelligent += increase;
  }
  useAvailableSkillPoints(increase);
}




/*------------------------------------------  WILL POWER  ------------------------------------------*/
/// Will power increases Player's magic damage and mana regeneration.
var mcWillPower: int = 10;
public function get WillPower(): int
{
  return mcWillPower;
}
public function set WillPower(value: int)
{
  if (value < 0)
  {
    value = 0;
  }
  mcWillPower = value;
  ManaRegeneration = mcBaseWillPower + (mcBaseWillPower * (mcWillPower - mcBaseWillPower) / mcBaseWillPower);
  if (mcMagicAttackBehavior)
  {
    mcMagicAttackBehavior.CharactersWillPower = WillPower;
  }
}
var mcBaseWillPower: int = 10;

public function increaseWillPower(increase: int)
{
  if (AvailableSkillPoints > 0)
  {
    WillPower += increase;
  }
  useAvailableSkillPoints(increase);
}



/*------------------------------------------  AGILITY  ------------------------------------------*/
/// Increases posibility to avoid attacks.
// TODO: add this possiblity to avoid attack.
var mcAgility: int = 10;
var mcBaseAgility: int = 10;




/*------------------------------------------  HEALTH  ------------------------------------------*/
/// Contains current Player's health. Read-only property.
var mcHealth: int;
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

  // inform listeners that health is changed.
  for (var i = 0; i < mcStatsListeners.Count; i++)
  {
    mcStatsListeners[i].onHealthChanged(mcHealth);
  }
}

/// Contains Player's Max health level. Read-only property for external usage.
var mcMaxHealth: int;
public function get MaxHealth(): int
{
  return mcMaxHealth;
}
private function set MaxHealth(value: int)
{
  if (value > mcMaxHealth)
  {
    Health = value; // restore health if max health is changed to a bigger value.
  }
  mcMaxHealth = value;
  if (mcMaxHealth < Health) // something decreased our max Health level, let's 'fix' current health level.
  {
    Health = mcMaxHealth;
  }
}
var mcBaseHealth: int = 100;




/*------------------------------------------  MANA  ------------------------------------------*/
/// Contains current Player's mana. Read-only property.
var mcMana: int;
public function get Mana(): int
{
  return mcMana;
}
private function set Mana(value: int)
{
  if (value < 0)
  {
    value = 0;
  }
  if (value > MaxMana)
  {
    value = MaxMana;
  }
  mcMana = value;

  // inform listeners that mana is changed.
  for (var i = 0; i < mcStatsListeners.Count; i++)
  {
    mcStatsListeners[i].onManaChanged(mcMana);
  }
}

/// Contains player's Max mana level.
var mcMaxMana: int = 100;
public function get MaxMana(): int
{
  return mcMaxMana;
}
private function set MaxMana(value: int)
{
  if (value > mcMaxMana)
  {
    Mana = value; // restore mana if max mana is changed to a bigger value.
  }
  mcMaxMana = value;
  if (mcMaxMana < mcMana) // something decreased our max Mana level, let's 'fix' current mana level.
  {
    Mana = mcMaxMana;
  }
}
var mcBaseMana: int = 100;

/*------------------------------------------  MANA  REGENERATION ------------------------------------------*/
/// Player's Mana regeneration. Read-only property. Depends on a Player's will power.
public var mcManaRegeneration: int;
public function get ManaRegeneration(): int
{
  return mcManaRegeneration;
}
private function set ManaRegeneration(value: int)
{
  if (value < 0)
  {
    value = 0;
  }
  mcManaRegeneration = value;
}

private var mcBaseManaRegeneration: int = 10;




/*------------------------------------------ EXPERIENCE  ------------------------------------------*/
var mcExperience: int = 0;
public function get Experience(): int
{
  return mcExperience;
}
private function set Experience(value: int)
{
  if (value < 0)
  {
    value = 0;
  }
  mcExperience = value;
  Level = 1 + mcExperience / mcExperienceLevelBase;
}
private var mcExperienceLevelBase: int = 100;


/*------------------------------------------  LEVEL  ------------------------------------------*/
/// Level depends on a current experience
var mcLevel: int = 1;
public function get Level(): int
{
  return mcLevel;
}
private function set Level(value: int)
{
  if (value == mcLevel)
  {
    return;
  }

  if (value < 1)
  {
    value = 1;
  }
  AvailableSkillPoints += value - mcLevel;
  mcLevel = value;

  // inform listeners that level is changed.
  for (var i = 0; i < mcStatsListeners.Count; i++)
  {
    mcStatsListeners[i].onLevelChanged(mcLevel);
  }
}
/*------------------------------------------  AVAILABLE SKILL POINTS  ------------------------------------------*/
/// Available skill points are increased when Player gains a level.
var mcAvailableSkillPoints: int = 0;
public function get AvailableSkillPoints(): int
{
  return mcAvailableSkillPoints;
}
private function set AvailableSkillPoints(value: int)
{
  if (value == mcAvailableSkillPoints)
  {
    return;
  }

  if (value < 0)
  {
    value = 0;
  }
  mcAvailableSkillPoints = value;

  // inform listeners that available skill points are changed.
  for (var i = 0; i < mcStatsListeners.Count; i++)
  {
    mcStatsListeners[i].onAvailableSkillPointsChanged(mcAvailableSkillPoints);
  }
}

private function useAvailableSkillPoints(usedPoints: int)
{
  AvailableSkillPoints -= usedPoints;
}



/*------------------------------------------  MELEE ATTACK ------------------------------------------*/
var mcMeleeDamage: int = 10.0f;
private function set MeleeDamage(value: int)
{
  if (value < 0)
  {
    value = 0;
  }
  mcMeleeDamage = value;
}
public function get MeleeDamage(): int
{
  return mcMeleeDamage;
}
private var mcBaseMeleeDamage: float = 10.0f;


/*------------------------------------------  MAGIC ATTACK ------------------------------------------*/
/// Holds a game object that is used as a Magic Attack.
var mcMagicAttack: GameObject;
public function set MagicAttack(value: GameObject)
{
  mcMagicAttack = value;
  if (mcMagicAttack)
  {
    mcMagicAttackBehavior = mcMagicAttack.GetComponent(ProjectileBehavior);
    mcMagicAttackBehavior.CharactersWillPower = WillPower;
  }
}
public function get MagicAttack(): GameObject
{
  return mcMagicAttack;
}
private var mcMagicAttackBehavior: ProjectileBehavior; // TODO: replace by a MagicAttackStats.

public function get MagicDamage(): int
{
  var damage = 0;
  if (mcMagicAttackBehavior)
  {
    damage = mcMagicAttackBehavior.mcDamage;
  }
  return damage;
}

public function get MagicAttackType(): DamageType
{
  var type: DamageType;
  if (mcMagicAttackBehavior)
  {
    type = mcMagicAttackBehavior.mcDamageType;
  }
  return type;
}

public function useMagicAttack(position: Vector3, rotation: Quaternion)
{
  if (mcMagicAttackBehavior)
  {
    if (mcMagicAttackBehavior.ManaCost <= Mana)
    {
      applyManaChange(-mcMagicAttackBehavior.ManaCost);
      var newMagicAttack = Instantiate(mcMagicAttack, position, rotation);
      var attackBehavior = newMagicAttack.GetComponent(ProjectileBehavior);
      attackBehavior.CharactersWillPower = WillPower;
    }
  }
}


/*------------------------------------------  METHODS  ------------------------------------------*/
function Start()
{
  Strength = mcStrength; // sets MaxHealth as well.
  Intelligent = mcIntelligent; // Sets MaxMana as well.
  WillPower = mcWillPower;
  Health = MaxHealth;
  Mana = MaxMana;
  MagicAttack = mcMagicAttack;
}

public function applyDamage(damage: Damage)
{
  // TODO: check type's resistant to calculate the real damage.
  var healthDrain = damage.DamageValue;
  Health -= healthDrain;
}

public function applyScore(score: int)
{
  Experience += score;
}

public function applyManaChange(manaChangedValue: int)
{
  Mana += manaChangedValue;
}

public function doManaRegeneration()
{
  Mana += ManaRegeneration;
}

public function getMeleeDamage(): Damage
{
  return new Damage(DamageType.Physical, mcMeleeDamage);
}

public function addPlayerStatsListener(listener: PlayerStatsListener)
{
  mcStatsListeners.Add(listener);
}

public function removePlayerStatsListener(listener: PlayerStatsListener)
{
  mcStatsListeners.Remove(listener);
}

@script AddComponentMenu ("Player/Player Stats")
