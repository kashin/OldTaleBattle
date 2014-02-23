#pragma strict
public class AnvilsShield extends BasicMagicAttackBehavior
{

private var shieldsTransform: Transform;
private var playersTransform: Transform;

function Start()
{
	super.Start();
	// setting Player's stats to all children (anvils)
	var anvils : AnvilFromShield[];
	anvils = gameObject.GetComponentsInChildren.<AnvilFromShield>();
	for (var anvil : AnvilFromShield in anvils) {
		anvil.AttackStats.PlayerStats = AttackStats.PlayerStats;
	}
  shieldsTransform = transform;
  playersTransform = AttackStats.PlayerStats.gameObject.transform;
}

function Update()
{
  shieldsTransform.position = playersTransform.position;
}

}

@script AddComponentMenu ("Spells/Anvil's Shield")