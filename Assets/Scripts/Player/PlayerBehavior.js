#pragma strict

public var mcAttackAnimation = "Attack";
public var mcIdleAnimation = "Idle";
public var mcMoveAnimation = "Run";

function Update()
{
  updateAnimation();
}

private function updateAnimation()
{
  if (!animation.IsPlaying(mcMoveAnimation))
  {
    animation.CrossFade(mcMoveAnimation);
  }
}

@script RequireComponent (Animation)

@script AddComponentMenu ("Character/Player Behavior")
