
public var mcAnimationsNames: String[] = ["Attack", "Walk", "Dance"];

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
    while (animation.IsPlaying(mcAnimationsNames[index]))
    {
      index = Random.Range(0, mcAnimationsNames.Length);
    }
    animation.CrossFade(mcAnimationsNames[index]);
  }
}

@script RequireComponent (Animation)
@script AddComponentMenu ("Mobs/Model Behavior")

