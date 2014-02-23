private var startedRotation : Quaternion;

function Start()
{
	startedRotation = transform.rotation;
}

function Update()
{
    transform.rotation = startedRotation;
}

@script AddComponentMenu ("General/Ignore parent's rotation")