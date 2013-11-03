#pragma strict

/// This component contains Player's stats and updates Player's speed/damage/etc according to this stats.

/*-------  STATS  -------*/
/// Strength is a stat that increases Player's health and physical damage.
var mcStrength: int = 10;
public function get Strength(): int
{
  return mcStrength;
}
public function set Strength(value: int)
{
  mcStrength = value;
  MaxHealth = MaxHealth + (mcBaseHealth * (mcStrength - mcBaseStrength) / mcBaseStrength);
}
var mcBaseStrength: int = 10;

/// Intelligent increases Player's Mana.
var mcIntelligent: int = 10;
public function get Intelligent(): int
{
  return mcIntelligent;
}
public function set Intelligent(value: int)
{
  mcIntelligent = value;
  MaxMana = MaxMana + (mcBaseMana * (mcIntelligent - mcBaseIntelligent) / mcBaseIntelligent);
}
var mcBaseIntelligent: int = 10;

/// Will power increases Player's magic damage.
var mcWillPower: int = 10;
var mcBaseWillPower: int = 10;

/// Increases posibility to avoid attacks.
var mcAgility: int = 10;
var mcBaseAgility: int = 10;

/*-------  HEALTH  -------*/
/// Contains current Player's health. Read-only property.
var mcHealth: int;
public function get Health(): int
{
  return mcHealth;
}
private function set Health(value: int)
{
  if (value >= 0)
  {
    mcHealth = value;
  }
  else
  {
    mcHealth = 0;
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
    mcHealth = value; // restore health if max health is changed to a bigger value.
  }
  mcMaxHealth = value;
  if (mcMaxHealth < mcHealth) // something decreased our max Health level, let's 'fix' current health level.
  {
    mcHealth = mcMaxHealth;
  }
}
var mcBaseHealth: int = 100;

/*-------  MANA  -------*/
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
  mcMana = value;
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
    mcMana = value; // restore mana if max mana is changed to a bigger value.
  }
  mcMaxMana = value;
  if (mcMaxMana < mcMana) // something decreased our max Mana level, let's 'fix' current mana level.
  {
    mcMana = mcMaxMana;
  }
}
var mcBaseMana: int = 100;

function Start()
{
  Strength = mcStrength; // sets MaxHealth as well.
  Intelligent = mcIntelligent; // Sets MaxMana as well.
  Health = MaxHealth;
  Mana = MaxMana;
}

public function applyDamage(damage: Damage)
{
  // TODO: check type's resistant to calculate the real damage.
  var healthDrain = damage.DamageValue;
  Health -= healthDrain;
}

public function applyManaChange(manaChangedValue: int)
{
  Mana += manaChangedValue;
}

@script AddComponentMenu ("Player/Player Stats")
