public class BasicMagicAttackBehavior extends ProjectileBehavior
{
  public var mcManaCost: int = 10;
  public var mcBaseDamage: int = 10;
  public var mcBaseWillPower: int = 10;

  function Awake()
  {
    AttackStats.ManaCost = mcManaCost;
    AttackStats.BaseDamage = mcBaseDamage;
    AttackStats.BaseWillPower = mcBaseWillPower;
  }
}