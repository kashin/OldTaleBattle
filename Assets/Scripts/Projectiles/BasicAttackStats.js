/// This class contains(holds) some basic stats for all attacks (like player stats, damage, etc)

public class BasicAttackStats
{
/*------------------------------------------ PLAYER STATS ------------------------------------------*/
  /// holds PlayerStats object.
  var mPlayerStats: PlayerStats;
  public function get PlayerStats(): PlayerStats
  {
    return mPlayerStats;
  }
  public function set PlayerStats(value: PlayerStats)
  {
    mPlayerStats = value;
    if (mPlayerStats != null)
    {
      Damage = BaseWillPower + (mPlayerStats.WillPower - BaseWillPower) * 2;
    }
  }

/*------------------------------------------ BASE ATTACK STATS ------------------------------------------*/
  var mBaseWillPower: int = 10;
  public function get BaseWillPower() : int
  {
    return mBaseWillPower;
  }
  public function set BaseWillPower(value: int)
  {
    mBaseWillPower = value;
  }

  var mBaseDamage: int = 10;
  public function get BaseDamage(): int
  {
    return mBaseDamage;
  }
  public function set BaseDamage(value: int)
  {
    var percentage: float = mDamage / mBaseDamage;
    if (value < 0)
    {
      value = 0;
    }
    mBaseDamage = value;
    Damage = Mathf.FloorToInt(percentage * value);
  }

/*------------------------------------------ DAMAGE STATS ------------------------------------------*/
  /// Damage should depend on a player's stats
  var mDamage: int = 10;
  public function get Damage(): int
  {
    return mDamage;
  }
  protected function set Damage(value: int)
  {
    if (value < 0)
    {
      value = 0;
    }
    mDamage = value;
  }

  /// Holds a type of this attack.
  var mDamageType: DamageType = DamageType.Fire;
  public function get DamageType(): DamageType
  {
    return mDamageType;
  }
  public function set DamageType(value: DamageType)
  {
    mDamageType = value;
  }

/*------------------------------------------ SPELL/ATTACK COSTS ------------------------------------------*/
  /// makes sense only for magic attacks
  var mManaCost: int = 10;
  public function get ManaCost(): int
  {
    return mManaCost;
  }
  public function set ManaCost(value: int)
  {
    if (value < 0)
    {
      value = 0;
    }
    mManaCost = value;
  }
  /// TODO: add stamina cost.

  /*------------------------------------------ CHARACTER ANIMATION ------------------------------------------*/
  var mCharacterAnimation = "Attack";
  public function get CharacterAnimation(): String
  {
    return mCharacterAnimation;
  }
  public function set CharacterAnimation(value: String)
  {
    mCharacterAnimation = value;
  }
}