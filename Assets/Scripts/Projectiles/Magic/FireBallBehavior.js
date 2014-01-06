public class FireBallBehavior extends BasicMagicAttackBehavior
{
  function Awake()
  {
    super.Awake();
    AttackStats.DamageType = DamageType.Fire;
  }
}

@script AddComponentMenu ("Attacks/Fire Ball Attack")
