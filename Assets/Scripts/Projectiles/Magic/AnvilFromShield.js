#pragma strict

public class AnvilFromShield extends BasicMagicAttackBehavior
{
public var rotationAngelPerSecond: float = 120.0f;

private var anvilTransform: Transform;
private var parentsTransform: Transform;

function Start()
{
	super.Start();
	anvilTransform = transform;
	parentsTransform = anvilTransform.parent.transform;
}

function Update()
{
	anvilTransform.RotateAround(parentsTransform.position, Vector3.up, rotationAngelPerSecond * Time.deltaTime);
}

}

@script AddComponentMenu ("Spells/Anvil From Shield")