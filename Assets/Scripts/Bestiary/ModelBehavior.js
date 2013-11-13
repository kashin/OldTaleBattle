
public var mcAnimationsNames: String[] = ["Attack", "Walk", "Dance"];

private var mcNextAnimationToPlay = "attack";
private var mcCanCrossFade = true;
function Start()
{
  animation.wrapMode = WrapMode.Loop;
  animation.Play();
}

function Update()
{
  if (Input.GetButtonDown("Bestiary Action"))
  {
    var index = Random.Range(0, mcAnimationsNames.Length);
    if (animation.IsPlaying(mcAnimationsNames[index]))
    {
      index++;
      if (index >= mcAnimationsNames.Length)
      {
        index = 0;
      }
    }
    if (!animation.IsPlaying(mcAnimationsNames[index]) && mcCanCrossFade)
    {
      mcCanCrossFade = false;
      animation.CrossFade(mcAnimationsNames[index]);
      Invoke("updateCanCrossFade", 0.5f);
    }
  }
}

private function updateCanCrossFade()
{
  mcCanCrossFade = true;
  CancelInvoke();
}

@script RequireComponent (Animation)
@script AddComponentMenu ("Mobs/Model Behavior")

